"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import type { Battle } from "@/schema";

/**
 * 슬러그 기반 북마크 토글. 인증 안 됐으면 throw — 클라이언트가 잡아 /login 유도.
 * 슬러그로 받는 이유: 공개 Battle 타입엔 UUID가 없어서 (JSON fallback 호환).
 */
export async function toggleBookmark(battleSlug: string): Promise<{ bookmarked: boolean }> {
  if (!isDbConfigured()) throw new Error("DB가 연결되지 않았습니다.");

  const authUser = await getCurrentAuthUser();
  if (!authUser) throw new Error("UNAUTHENTICATED");

  const db = getDb();

  const [battle] = await db
    .select({ id: schema.battles.id })
    .from(schema.battles)
    .where(eq(schema.battles.slug, battleSlug))
    .limit(1);

  if (!battle) throw new Error("BATTLE_NOT_FOUND");

  const [existing] = await db
    .select({ userId: schema.bookmarks.userId })
    .from(schema.bookmarks)
    .where(and(eq(schema.bookmarks.userId, authUser.id), eq(schema.bookmarks.battleId, battle.id)))
    .limit(1);

  if (existing) {
    await db
      .delete(schema.bookmarks)
      .where(
        and(eq(schema.bookmarks.userId, authUser.id), eq(schema.bookmarks.battleId, battle.id)),
      );
    revalidatePath("/profile/bookmarks");
    return { bookmarked: false };
  }

  await db.insert(schema.bookmarks).values({ userId: authUser.id, battleId: battle.id });
  revalidatePath("/profile/bookmarks");
  return { bookmarked: true };
}

/**
 * 사용자가 북마크한 모든 슬러그 — 리스트 페이지에서 일괄 조회.
 */
export async function getBookmarkedSlugs(authId: string): Promise<Set<string>> {
  if (!isDbConfigured()) return new Set();
  const rows = await getDb()
    .select({ slug: schema.battles.slug })
    .from(schema.bookmarks)
    .innerJoin(schema.battles, eq(schema.bookmarks.battleId, schema.battles.id))
    .where(eq(schema.bookmarks.userId, authId));
  return new Set(rows.map((r) => r.slug));
}

/**
 * 사용자의 북마크 배틀 전체 (최신 북마크 순).
 */
export async function getBookmarkedBattles(authId: string): Promise<Battle[]> {
  if (!isDbConfigured()) return [];
  const rows = await getDb()
    .select({ battle: schema.battles })
    .from(schema.bookmarks)
    .innerJoin(schema.battles, eq(schema.bookmarks.battleId, schema.battles.id))
    .where(eq(schema.bookmarks.userId, authId))
    .orderBy(desc(schema.bookmarks.createdAt));

  return rows.map(({ battle: r }) => ({
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    description: r.description ?? undefined,
    date: r.date,
    endDate: r.endDate ?? undefined,
    registrationDeadline: r.registrationDeadline ?? undefined,
    genres: r.genres as Battle["genres"],
    formats: r.formats as Battle["formats"],
    status: r.status as Battle["status"],
    venue: r.venue,
    organizer: r.organizer,
    judges: r.judges ?? undefined,
    prize: r.prize ?? undefined,
    entryFee: r.entryFee ?? undefined,
    posterUrl: r.posterUrl ?? undefined,
    links: r.links ?? [],
    results: r.results ?? undefined,
    tags: r.tags ?? undefined,
  }));
}
