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
