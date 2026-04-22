import type { SourceType } from "@/schema";

export interface FetchedSource {
  sourceType: SourceType;
  sourceUrl: string;
  sourceId: string;
  rawContent: string;
  rawMetadata?: Record<string, unknown>;
}

export interface SourceAdapter {
  match(url: string): boolean;
  fetch(url: string): Promise<FetchedSource>;
}
