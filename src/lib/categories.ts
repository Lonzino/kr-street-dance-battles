"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import { type BattleCategory, BattleCategoryInput } from "@/schema";

type Row = typeof schema.battleCategories.$inferSelect;

function rowToCategory(r: Row): BattleCategory {
  return {
    id: r.id,
    battleId: r.battleId,
    name: r.name,
    genres: r.genres as BattleCategory["genres"],
    format: r.format as BattleCategory["format"],
    maxParticipants: r.maxParticipants ?? null,
    registrationFee: r.registrationFee ?? null,
    paymentInstruction: r.paymentInstruction ?? null,
    closesAt: r.closesAt?.toISOString() ?? null,
    sortOrder: r.sortOrder,
  };
}

export async function getCategoriesForBattle(battleId: string): Promise<BattleCategory[]> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select()
    .from(schema.battleCategories)
    .where(eq(schema.battleCategories.battleId, battleId))
    .orderBy(asc(schema.battleCategories.sortOrder), asc(schema.battleCategories.name));
  return rows.map(rowToCategory);
}

export async function getCategoryById(id: string): Promise<BattleCategory | null> {
  if (!isDbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(schema.battleCategories)
    .where(eq(schema.battleCategories.id, id))
    .limit(1);
  return row ? rowToCategory(row) : null;
}

export async function createCategory(
  battleId: string,
  input: unknown,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const ctx = await loadAuthzContext(authUser.id);
  if (!(await canEditBattle(ctx, battleId))) return { ok: false, error: "FORBIDDEN" };

  const parsed = BattleCategoryInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const [inserted] = await getDb()
    .insert(schema.battleCategories)
    .values({
      battleId,
      name: parsed.data.name,
      genres: parsed.data.genres,
      format: parsed.data.format,
      maxParticipants: parsed.data.maxParticipants,
      registrationFee: parsed.data.registrationFee,
      paymentInstruction: parsed.data.paymentInstruction,
      closesAt: parsed.data.closesAt ? new Date(parsed.data.closesAt) : null,
    })
    .returning({ id: schema.battleCategories.id });

  return { ok: true, id: inserted.id };
}

export async function deleteCategory(
  categoryId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const cat = await getCategoryById(categoryId);
  if (!cat) return { ok: false, error: "NOT_FOUND" };

  const ctx = await loadAuthzContext(authUser.id);
  if (!(await canEditBattle(ctx, cat.battleId))) return { ok: false, error: "FORBIDDEN" };

  await getDb().delete(schema.battleCategories).where(eq(schema.battleCategories.id, categoryId));
  return { ok: true };
}

export async function revalidateCategoryPaths(battleSlug: string) {
  revalidatePath(`/battles/${battleSlug}`);
  revalidatePath(`/battles/${battleSlug}/admin`);
  revalidatePath(`/battles/${battleSlug}/register`);
}
