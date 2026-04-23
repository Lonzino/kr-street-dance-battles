import { z } from "zod";
import { RecordStatus, SourceType } from "./enums";

export const SourceRecord = z.object({
  id: z.uuid().optional(),
  sourceType: SourceType,
  sourceUrl: z.url(),
  sourceId: z.string().min(1),
  rawContent: z.string(),
  rawMetadata: z.record(z.string(), z.unknown()).optional(),
  fetchedAt: z.iso.datetime(),
  status: RecordStatus,
  parsedPayload: z.unknown().optional(),
  parseConfidence: z.number().min(0).max(1).optional(),
  parseModel: z.string().optional(),
  parseWarnings: z.array(z.string()).optional(),
  parsedBattleId: z.uuid().optional(),
  reviewerNote: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.iso.datetime().optional(),
});
export type SourceRecord = z.infer<typeof SourceRecord>;

export const ExtractionResult = z.object({
  confidence: z.number().min(0).max(1),
  battle: z.unknown(),
  warnings: z.array(z.string()).default([]),
});
export type ExtractionResult = z.infer<typeof ExtractionResult>;
