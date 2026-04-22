import { z } from "zod";
import { RecordStatus, SourceType } from "./enums";

export const SourceRecord = z.object({
  id: z.string().uuid().optional(),
  sourceType: SourceType,
  sourceUrl: z.url(),
  sourceId: z.string().min(1),
  rawContent: z.string(),
  fetchedAt: z.iso.datetime(),
  status: RecordStatus,
  parsedBattleSlug: z.string().optional(),
  parseConfidence: z.number().min(0).max(1).optional(),
  reviewerNote: z.string().optional(),
});
export type SourceRecord = z.infer<typeof SourceRecord>;

export const ExtractionResult = z.object({
  confidence: z.number().min(0).max(1),
  battle: z.unknown(),
  warnings: z.array(z.string()).default([]),
});
export type ExtractionResult = z.infer<typeof ExtractionResult>;
