import type { FetchedSource, SourceAdapter } from "./types";

/**
 * Manual 어댑터: 사용자가 직접 텍스트를 붙여넣은 경우.
 * URL이 아닌 경우 이 어댑터로 fallback.
 */
export const manualAdapter: SourceAdapter = {
  match() {
    return true; // fallback for everything
  },

  async fetch(input): Promise<FetchedSource> {
    return {
      sourceType: "manual",
      sourceUrl: input.startsWith("http") ? input : "manual://submission",
      sourceId: `manual-${Date.now()}`,
      rawContent: input,
    };
  },
};
