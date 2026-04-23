"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory } from "@/lib/categories";
import { checkInByToken, updateRegistrationByOrganizer } from "@/lib/registrations";
import type { BattleFormat, DanceGenre, PaymentStatus, RegistrationStatus } from "@/schema";

export async function addCategory(
  battleId: string,
  battleSlug: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await createCategory(battleId, {
    name: String(formData.get("name") ?? "").trim(),
    genres: formData.getAll("genres").map(String) as DanceGenre[],
    format: String(formData.get("format") ?? "1v1") as BattleFormat,
    maxParticipants: formData.get("maxParticipants")
      ? Number(formData.get("maxParticipants"))
      : null,
    registrationFee: formData.get("registrationFee")
      ? Number(formData.get("registrationFee"))
      : null,
    paymentInstruction: String(formData.get("paymentInstruction") ?? "").trim() || null,
    closesAt: String(formData.get("closesAt") ?? "").trim()
      ? new Date(String(formData.get("closesAt"))).toISOString()
      : null,
  });

  if (!result.ok) return result;
  revalidatePath(`/battles/${battleSlug}/admin`);
  return { ok: true };
}

export async function removeCategory(
  categoryId: string,
  battleSlug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteCategory(categoryId);
  if (!result.ok) return result;
  revalidatePath(`/battles/${battleSlug}/admin`);
  return { ok: true };
}

export async function setRegistrationStatus(
  registrationId: string,
  battleId: string,
  battleSlug: string,
  status: RegistrationStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await updateRegistrationByOrganizer(registrationId, battleId, { status });
  if (!result.ok) return result;
  revalidatePath(`/battles/${battleSlug}/admin`);
  revalidatePath("/profile");
  return { ok: true };
}

export async function setPaymentStatus(
  registrationId: string,
  battleId: string,
  battleSlug: string,
  paymentStatus: PaymentStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await updateRegistrationByOrganizer(registrationId, battleId, { paymentStatus });
  if (!result.ok) return result;
  revalidatePath(`/battles/${battleSlug}/admin`);
  return { ok: true };
}

export async function performCheckIn(
  battleId: string,
  battleSlug: string,
  token: string,
): Promise<
  | { ok: true; nickname: string | null; categoryName: string; alreadyChecked: boolean }
  | { ok: false; error: string }
> {
  const result = await checkInByToken(token, battleId);
  if (!result.ok) return result;

  // 카테고리·사용자 정보 추가 조회
  const { getDb, schema } = await import("@/db/client");
  const { eq } = await import("drizzle-orm");
  const db = getDb();
  const [info] = await db
    .select({
      nickname: schema.users.nickname,
      categoryName: schema.battleCategories.name,
    })
    .from(schema.registrations)
    .innerJoin(schema.users, eq(schema.users.id, schema.registrations.userId))
    .innerJoin(
      schema.battleCategories,
      eq(schema.battleCategories.id, schema.registrations.categoryId),
    )
    .where(eq(schema.registrations.id, result.registration.id))
    .limit(1);

  revalidatePath(`/battles/${battleSlug}/admin`);

  return {
    ok: true,
    nickname: info?.nickname ?? null,
    categoryName: info?.categoryName ?? "",
    alreadyChecked: result.alreadyChecked,
  };
}
