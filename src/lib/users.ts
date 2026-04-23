import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { type User, UserProfileInput } from "@/schema";

/**
 * 사용자 헬퍼 — Supabase Auth로 로그인된 user 객체와 DB 프로필을 연결.
 */

type UserRow = typeof schema.users.$inferSelect;

function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    email: r.email ?? null,
    nickname: r.nickname ?? null,
    bio: r.bio ?? null,
    region: r.region ?? null,
    primaryGenres: r.primaryGenres ?? null,
    instagramHandle: r.instagramHandle ?? null,
    avatarUrl: r.avatarUrl ?? null,
    role: r.role,
    approvedSubmissions: r.approvedSubmissions,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

/**
 * Supabase auth user.id로 DB의 users row를 가져옴. 없으면 생성(upsert).
 * OAuth 콜백 후 첫 진입 시 자동 호출됨.
 */
export async function ensureUserRow(
  authId: string,
  email?: string | null,
  avatarUrl?: string | null,
): Promise<User | null> {
  if (!isDbConfigured()) return null;
  const db = getDb();

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, authId))
    .limit(1);
  if (existing) return rowToUser(existing);

  const [inserted] = await db
    .insert(schema.users)
    .values({
      id: authId,
      email: email ?? null,
      avatarUrl: avatarUrl ?? null,
      role: "user",
    })
    .onConflictDoNothing({ target: schema.users.id })
    .returning();

  return inserted ? rowToUser(inserted) : null;
}

export async function getUserProfile(authId: string): Promise<User | null> {
  if (!isDbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, authId))
    .limit(1);
  return row ? rowToUser(row) : null;
}

/**
 * 닉네임 중복 검사 — 자기 자신은 제외.
 */
export async function isNicknameTaken(nickname: string, excludeAuthId: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const [row] = await getDb()
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.nickname, nickname))
    .limit(1);
  return Boolean(row && row.id !== excludeAuthId);
}

export async function updateUserProfile(
  authId: string,
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = UserProfileInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  if (parsed.data.nickname) {
    const taken = await isNicknameTaken(parsed.data.nickname, authId);
    if (taken) return { ok: false, error: "이미 사용 중인 닉네임입니다." };
  }

  if (!isDbConfigured()) {
    return { ok: false, error: "DB가 연결되지 않았습니다." };
  }

  await getDb().update(schema.users).set(parsed.data).where(eq(schema.users.id, authId));
  return { ok: true };
}

/**
 * 회원 탈퇴 — DB 데이터 삭제 + auth.users 삭제 + 익명화.
 *
 * 흐름:
 * 1. source_records.rawContent에서 submitter authId를 익명 해시로 교체
 * 2. users 테이블 row 삭제 (cascade로 bookmarks/notification_prefs/organizer_claims 자동 삭제)
 *    edit_log.userId는 onDelete: set null
 * 3. Supabase auth.users 삭제 (service_role key 필요, 미설정 시 안내만)
 *
 * 전제: 호출자가 본인 인증 검증 완료 (서버 액션에서 getCurrentAuthUser).
 */
export async function deleteUserAccount(
  authId: string,
): Promise<{ ok: true; authDeleted: boolean } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const db = getDb();

  // 1. source_records anonymize
  // submitter authId를 SHA256 해시로 교체 (역추적 방지, 통계용 식별자 유지)
  const hash = await sha256Hex(authId);
  const anonId = `deleted-${hash.slice(0, 16)}`;

  const allRecords = await db.select().from(schema.sourceRecords);
  for (const r of allRecords) {
    if (!r.rawContent) continue;
    if (!r.rawContent.includes(authId)) continue;
    try {
      const obj = JSON.parse(r.rawContent);
      if (obj.submitter === authId) obj.submitter = anonId;
      if (obj.userId === authId) obj.userId = anonId;
      if (obj.userEmail) obj.userEmail = "<deleted>";
      await db
        .update(schema.sourceRecords)
        .set({ rawContent: JSON.stringify(obj) })
        .where(eq(schema.sourceRecords.id, r.id));
    } catch {
      // JSON 아닌 경우 — 단순 문자열 치환
      await db
        .update(schema.sourceRecords)
        .set({ rawContent: r.rawContent.replaceAll(authId, anonId) })
        .where(eq(schema.sourceRecords.id, r.id));
    }
  }

  // 2. users row 삭제 — cascade로 bookmarks/prefs/claims 자동 삭제
  await db.delete(schema.users).where(eq(schema.users.id, authId));

  // 3. auth.users 삭제 (service_role 필요)
  let authDeleted = false;
  try {
    const { getSupabaseAdminClient, isSupabaseAdminConfigured } = await import(
      "@/lib/supabase/admin"
    );
    if (isSupabaseAdminConfigured()) {
      const admin = getSupabaseAdminClient();
      const { error } = await admin.auth.admin.deleteUser(authId);
      if (!error) authDeleted = true;
    }
  } catch {
    // SUPABASE_SERVICE_ROLE_KEY 미설정 — 무시, 안내만
  }

  return { ok: true, authDeleted };
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
