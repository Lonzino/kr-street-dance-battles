"use server";

import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { generateCheckInToken } from "@/lib/check-in";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import {
  type PaymentStatus,
  type Registration,
  RegistrationInput,
  type RegistrationStatus,
} from "@/schema";

type Row = typeof schema.registrations.$inferSelect;

function rowToRegistration(r: Row): Registration {
  return {
    id: r.id,
    categoryId: r.categoryId,
    userId: r.userId,
    status: r.status as RegistrationStatus,
    paymentStatus: r.paymentStatus as PaymentStatus,
    partnerName: r.partnerName ?? null,
    crewName: r.crewName ?? null,
    note: r.note ?? null,
    organizerNote: r.organizerNote ?? null,
    checkInToken: r.checkInToken,
    registeredAt: r.registeredAt.toISOString(),
    confirmedAt: r.confirmedAt?.toISOString() ?? null,
    checkedInAt: r.checkedInAt?.toISOString() ?? null,
    cancelledAt: r.cancelledAt?.toISOString() ?? null,
  };
}

/**
 * 사용자가 부문에 신청. 정원 체크 후 status=pending 또는 waitlist.
 * 같은 부문 중복 신청은 unique 제약으로 차단.
 */
export async function createRegistration(
  input: unknown,
): Promise<{ ok: true; id: string; status: RegistrationStatus } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const parsed = RegistrationInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const db = getDb();

  // 부문 정보 조회
  const [cat] = await db
    .select()
    .from(schema.battleCategories)
    .where(eq(schema.battleCategories.id, parsed.data.categoryId))
    .limit(1);
  if (!cat) return { ok: false, error: "CATEGORY_NOT_FOUND" };

  // 마감 체크
  if (cat.closesAt && cat.closesAt < new Date()) {
    return { ok: false, error: "신청 마감되었습니다." };
  }

  // 정원 체크 (confirmed/checked_in/pending 모두 카운트)
  let initialStatus: RegistrationStatus = "pending";
  if (cat.maxParticipants !== null) {
    const [{ value: currentCount }] = await db
      .select({ value: count() })
      .from(schema.registrations)
      .where(
        and(
          eq(schema.registrations.categoryId, cat.id),
          sql`${schema.registrations.status} in ('pending', 'confirmed', 'checked_in')`,
        ),
      );
    if (currentCount >= cat.maxParticipants) {
      initialStatus = "waitlist";
    }
  }

  try {
    const [inserted] = await db
      .insert(schema.registrations)
      .values({
        categoryId: parsed.data.categoryId,
        userId: authUser.id,
        status: initialStatus,
        partnerName: parsed.data.partnerName ?? null,
        crewName: parsed.data.crewName ?? null,
        note: parsed.data.note ?? null,
        checkInToken: generateCheckInToken(),
      })
      .returning({ id: schema.registrations.id });

    return { ok: true, id: inserted.id, status: initialStatus };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // partial unique index — cancelled 외 활성 신청만 차단
    if (msg.includes("registrations_user_category_active_uniq")) {
      return { ok: false, error: "이미 이 부문에 신청하셨습니다." };
    }
    return { ok: false, error: msg };
  }
}

/**
 * 사용자가 본인 신청 취소.
 */
export async function cancelOwnRegistration(
  registrationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const [existing] = await getDb()
    .select({ userId: schema.registrations.userId })
    .from(schema.registrations)
    .where(eq(schema.registrations.id, registrationId))
    .limit(1);

  if (!existing) return { ok: false, error: "NOT_FOUND" };
  if (existing.userId !== authUser.id) return { ok: false, error: "FORBIDDEN" };

  await getDb()
    .update(schema.registrations)
    .set({ status: "cancelled", cancelledAt: new Date() })
    .where(eq(schema.registrations.id, registrationId));

  return { ok: true };
}

/**
 * 주최자가 신청 상태 변경 (승인/거부/입금확인 등).
 */
export async function updateRegistrationByOrganizer(
  registrationId: string,
  battleId: string,
  patch: {
    status?: RegistrationStatus;
    paymentStatus?: PaymentStatus;
    organizerNote?: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const ctx = await loadAuthzContext(authUser.id);
  if (!(await canEditBattle(ctx, battleId))) return { ok: false, error: "FORBIDDEN" };

  const updates: Record<string, unknown> = { ...patch };
  if (patch.status === "confirmed") updates.confirmedAt = new Date();
  if (patch.status === "checked_in") updates.checkedInAt = new Date();

  await getDb()
    .update(schema.registrations)
    .set(updates)
    .where(eq(schema.registrations.id, registrationId));

  return { ok: true };
}

/**
 * 체크인 토큰으로 등록 조회 + 상태 변경.
 * 주최자가 QR 스캔 시 호출.
 */
export async function checkInByToken(
  token: string,
  battleId: string,
): Promise<
  { ok: true; registration: Registration; alreadyChecked: boolean } | { ok: false; error: string }
> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const ctx = await loadAuthzContext(authUser.id);
  if (!(await canEditBattle(ctx, battleId))) return { ok: false, error: "FORBIDDEN" };

  const [reg] = await getDb()
    .select()
    .from(schema.registrations)
    .where(eq(schema.registrations.checkInToken, token))
    .limit(1);

  if (!reg) return { ok: false, error: "유효하지 않은 토큰입니다." };

  // 같은 배틀의 부문인지 확인 (다른 배틀 토큰 거부)
  const [cat] = await getDb()
    .select({ battleId: schema.battleCategories.battleId })
    .from(schema.battleCategories)
    .where(eq(schema.battleCategories.id, reg.categoryId))
    .limit(1);

  if (!cat || cat.battleId !== battleId) {
    return { ok: false, error: "이 배틀의 신청이 아닙니다." };
  }

  if (reg.status === "checked_in") {
    return { ok: true, registration: rowToRegistration(reg), alreadyChecked: true };
  }
  if (reg.status === "cancelled" || reg.status === "no_show") {
    return { ok: false, error: `상태가 ${reg.status}입니다.` };
  }

  const now = new Date();
  await getDb()
    .update(schema.registrations)
    .set({ status: "checked_in", checkedInAt: now })
    .where(eq(schema.registrations.id, reg.id));

  return {
    ok: true,
    registration: {
      ...rowToRegistration(reg),
      status: "checked_in",
      checkedInAt: now.toISOString(),
    },
    alreadyChecked: false,
  };
}

/**
 * 카테고리별 신청 목록 (주최자용).
 */
export async function getRegistrationsForCategory(
  categoryId: string,
): Promise<Array<Registration & { user: { nickname: string | null; email: string | null } }>> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select({
      reg: schema.registrations,
      nickname: schema.users.nickname,
      email: schema.users.email,
    })
    .from(schema.registrations)
    .innerJoin(schema.users, eq(schema.registrations.userId, schema.users.id))
    .where(eq(schema.registrations.categoryId, categoryId))
    .orderBy(asc(schema.registrations.registeredAt));

  return rows.map((r) => ({
    ...rowToRegistration(r.reg),
    user: { nickname: r.nickname, email: r.email },
  }));
}

/**
 * 사용자 본인의 모든 신청 (프로필용).
 */
export async function getRegistrationsForUser(userId: string): Promise<
  Array<{
    registration: Registration;
    category: { id: string; name: string; battleId: string };
    battle: { slug: string; title: string; date: string };
  }>
> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select({
      reg: schema.registrations,
      catId: schema.battleCategories.id,
      catName: schema.battleCategories.name,
      catBattleId: schema.battleCategories.battleId,
      battleSlug: schema.battles.slug,
      battleTitle: schema.battles.title,
      battleDate: schema.battles.date,
    })
    .from(schema.registrations)
    .innerJoin(
      schema.battleCategories,
      eq(schema.registrations.categoryId, schema.battleCategories.id),
    )
    .innerJoin(schema.battles, eq(schema.battleCategories.battleId, schema.battles.id))
    .where(eq(schema.registrations.userId, userId))
    .orderBy(desc(schema.battles.date));

  return rows.map((r) => ({
    registration: rowToRegistration(r.reg),
    category: { id: r.catId, name: r.catName, battleId: r.catBattleId },
    battle: { slug: r.battleSlug, title: r.battleTitle, date: r.battleDate },
  }));
}

export async function revalidateRegistrationPaths(battleSlug: string) {
  revalidatePath(`/battles/${battleSlug}`);
  revalidatePath(`/battles/${battleSlug}/register`);
  revalidatePath(`/battles/${battleSlug}/admin`);
  revalidatePath("/profile");
}
