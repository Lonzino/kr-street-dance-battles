import { instagramAdapter } from "./instagram";
import { manualAdapter } from "./manual";
import type { SourceAdapter } from "./types";

export const adapters: SourceAdapter[] = [instagramAdapter, manualAdapter];

export function pickAdapter(input: string): SourceAdapter {
  return adapters.find((a) => a.match(input)) ?? manualAdapter;
}

export type { FetchedSource, SourceAdapter } from "./types";
