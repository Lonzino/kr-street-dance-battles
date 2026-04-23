"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import type { Battle } from "@/schema";

/**
 * 배틀 부분 편집 — 주최자/admin이 사용.
 * 변경 필드만 update하고 edit_log에 diff 기록.
 */
export async function updateBattle(
  battleId: string,
  battleSlug: string,
  patch: Partial<
    Pick<Battle, "title" | "subtitle" | "description" | "date" | "endDate" | "status" | "posterUrl">
  >,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const authUser = await getCurrentAuthUser();
  if (!authUser) return { ok: false, error: "UNAUTHENTICATED" };

  const ctx = await loadAuthzContext(authUser.id);
  const allowed = await canEditBattle(ctx, battleId);
  if (!allowed) return { ok: false, error: "FORBIDDEN" };

  const db = getDb();

  // 이전 값 조회 (edit_log용)
  const [before] = await db
    .select()
    .from(schema.battles)
    .where(eq(schema.battles.id, battleId))
    .limit(1);

  if (!before) return { ok: false, error: "BATTLE_NOT_FOUND" };

  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [k, v] of Object.entries(patch)) {
    const fromVal = (before as Record<string, unknown>)[k];
    if (fromVal !== v) changes[k] = { from: fromVal, to: v };
  }

  if (Object.keys(changes).length === 0) {
    return { ok: true };
  }

  await db
    .update(schema.battles)
    .set({ ...patch, updatedAt: sql`now()` })
    .where(eq(schema.battles.id, battleId));

  await db.insert(schema.editLog).values({
    battleId,
    userId: authUser.id,
    changes,
  });

  revalidatePath(`/battles/${battleSlug}`);
  revalidatePath(`/battles/${battleSlug}/edit`);
  revalidatePath("/");

  return { ok: true };
}
