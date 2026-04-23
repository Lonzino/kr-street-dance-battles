"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { Battle } from "@/schema";

/**
 * 검토 큐 승인 액션.
 *
 * 동작:
 * 1. source_record의 parsed_payload를 Battle 스키마로 strict 파싱 (실패 시 에러)
 * 2. battles 테이블에 UPSERT (slug 기준), is_published=true
 * 3. source_record 상태 → 'published' + parsed_battle_id 연결
 *
 * 멱등: 같은 record를 두 번 승인해도 같은 battle row 유지.
 */
export async function approveRecord(recordId: string, overridePayload?: unknown) {
  if (!isDbConfigured()) throw new Error("DB가 연결되지 않았습니다.");

  const db = getDb();

  const [record] = await db
    .select()
    .from(schema.sourceRecords)
    .where(eq(schema.sourceRecords.id, recordId))
    .limit(1);

  if (!record) throw new Error(`record 없음: ${recordId}`);
  if (record.status === "published") {
    throw new Error("이미 published 상태");
  }

  const payload = overridePayload ?? record.parsedPayload;
  const battle = Battle.parse(payload);

  const [inserted] = await db
    .insert(schema.battles)
    .values({
      slug: battle.slug,
      title: battle.title,
      subtitle: battle.subtitle,
      description: battle.description,
      date: battle.date,
      endDate: battle.endDate,
      registrationDeadline: battle.registrationDeadline,
      genres: battle.genres,
      formats: battle.formats,
      status: battle.status,
      venue: battle.venue,
      organizer: battle.organizer,
      judges: battle.judges,
      prize: battle.prize,
      entryFee: battle.entryFee,
      posterUrl: battle.posterUrl,
      links: battle.links,
      results: battle.results,
      tags: battle.tags,
      isPublished: true,
      sourceRecordId: recordId,
    })
    .onConflictDoUpdate({
      target: schema.battles.slug,
      set: {
        title: battle.title,
        subtitle: battle.subtitle,
        description: battle.description,
        date: battle.date,
        endDate: battle.endDate,
        registrationDeadline: battle.registrationDeadline,
        genres: battle.genres,
        formats: battle.formats,
        status: battle.status,
        venue: battle.venue,
        organizer: battle.organizer,
        judges: battle.judges,
        prize: battle.prize,
        entryFee: battle.entryFee,
        posterUrl: battle.posterUrl,
        links: battle.links,
        results: battle.results,
        tags: battle.tags,
        isPublished: true,
        sourceRecordId: recordId,
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: schema.battles.id });

  await db
    .update(schema.sourceRecords)
    .set({
      status: "published",
      parsedBattleId: inserted.id,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.sourceRecords.id, recordId));

  revalidatePath("/admin/queue");
  revalidatePath("/admin/battles");
  revalidatePath("/");
  revalidatePath(`/battles/${battle.slug}`);
}

export async function rejectRecord(recordId: string, note?: string) {
  if (!isDbConfigured()) throw new Error("DB가 연결되지 않았습니다.");

  const db = getDb();
  await db
    .update(schema.sourceRecords)
    .set({
      status: "rejected",
      reviewerNote: note,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.sourceRecords.id, recordId));

  revalidatePath("/admin/queue");
}

export async function unpublishBattle(battleId: string) {
  if (!isDbConfigured()) throw new Error("DB가 연결되지 않았습니다.");

  const db = getDb();
  await db
    .update(schema.battles)
    .set({ isPublished: false, updatedAt: new Date() })
    .where(eq(schema.battles.id, battleId));

  revalidatePath("/admin/battles");
  revalidatePath("/");
}
