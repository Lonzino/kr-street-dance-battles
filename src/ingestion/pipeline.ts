import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import { extractBattleFromText } from "./parsers/llm-extract";
import { pickAdapter } from "./sources";

/**
 * 통합 수집 파이프라인.
 *
 * URL 또는 raw 텍스트 입력 → DB의 source_records 테이블에 저장 (status='raw' → 'parsed').
 * 운영자가 admin에서 검토 후 'validated' → 'published' 승격.
 *
 * 같은 source_id 재호출은 UPSERT (idempotent).
 */
export async function ingest(input: string): Promise<{ recordId: string; confidence: number }> {
  const adapter = pickAdapter(input);
  const fetched = await adapter.fetch(input);

  const db = getDb();

  const [inserted] = await db
    .insert(schema.sourceRecords)
    .values({
      sourceType: fetched.sourceType,
      sourceUrl: fetched.sourceUrl,
      sourceId: fetched.sourceId,
      rawContent: fetched.rawContent,
      rawMetadata: fetched.rawMetadata,
      status: "raw",
    })
    .onConflictDoUpdate({
      target: [schema.sourceRecords.sourceType, schema.sourceRecords.sourceId],
      set: {
        rawContent: fetched.rawContent,
        rawMetadata: fetched.rawMetadata,
      },
    })
    .returning({ id: schema.sourceRecords.id });

  const recordId = inserted.id;

  const result = await extractBattleFromText(fetched.rawContent);

  await db
    .update(schema.sourceRecords)
    .set({
      status: "parsed",
      parsedPayload: result.battle,
      parseConfidence: result.confidence,
      parseModel: "claude-sonnet-4-6",
      parseWarnings: result.warnings,
      updatedAt: new Date(),
    })
    .where(eq(schema.sourceRecords.id, recordId));

  return { recordId, confidence: result.confidence };
}
