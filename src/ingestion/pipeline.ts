import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import { LLM_MODEL } from "@/lib/constants";
import { extractBattleFromText } from "./parsers/llm-extract";
import { pickAdapter } from "./sources";

/**
 * 통합 수집 파이프라인.
 *
 * URL 또는 raw 텍스트 입력 → source_records 테이블 (raw → parsed → 운영자 검토 → published).
 * 같은 (sourceType, sourceId)는 UPSERT (idempotent).
 *
 * 비용 가드:
 * - 같은 입력(rawContent 동일) + 이미 파싱된 record → LLM 재호출 스킵 (중복 과금 방지)
 * - 입력이 바뀌었거나 raw 상태면 (재)파싱
 */
export interface IngestResult {
  recordId: string;
  confidence: number;
  skipped?: "duplicate_content";
  error?: string;
}

export async function ingest(input: string): Promise<IngestResult> {
  const adapter = pickAdapter(input);
  const fetched = await adapter.fetch(input);

  const db = getDb();

  // 1. UPSERT raw record
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

  // 2. 중복 가드: 이미 같은 raw_content로 파싱된 적 있으면 LLM 재호출 안 함
  const [existing] = await db
    .select({
      status: schema.sourceRecords.status,
      content: schema.sourceRecords.rawContent,
      confidence: schema.sourceRecords.parseConfidence,
    })
    .from(schema.sourceRecords)
    .where(
      and(
        eq(schema.sourceRecords.sourceType, fetched.sourceType),
        eq(schema.sourceRecords.sourceId, fetched.sourceId),
      ),
    )
    .limit(1);

  if (existing && existing.status !== "raw" && existing.content === fetched.rawContent) {
    return {
      recordId,
      confidence: existing.confidence ?? 0,
      skipped: "duplicate_content",
    };
  }

  // 3. LLM 파싱 (실패해도 raw 상태 유지 + warnings 기록)
  try {
    const result = await extractBattleFromText(fetched.rawContent);

    await db
      .update(schema.sourceRecords)
      .set({
        status: "parsed",
        parsedPayload: result.battle,
        parseConfidence: result.confidence,
        parseModel: LLM_MODEL,
        parseWarnings: result.warnings,
        updatedAt: new Date(),
      })
      .where(eq(schema.sourceRecords.id, recordId));

    return { recordId, confidence: result.confidence };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    await db
      .update(schema.sourceRecords)
      .set({
        // status는 raw 유지 — 재시도 가능하게
        parseWarnings: [`extraction failed: ${errorMessage}`],
        updatedAt: new Date(),
      })
      .where(eq(schema.sourceRecords.id, recordId));

    return { recordId, confidence: 0, error: errorMessage };
  }
}
