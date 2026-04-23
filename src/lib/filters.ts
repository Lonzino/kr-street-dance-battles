import type { Battle, BattleStatus, DanceGenre, Region } from "@/schema";

export interface BattleFilters {
  genre?: DanceGenre;
  region?: Region;
  status?: BattleStatus;
  q?: string;
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): BattleFilters {
  const q = pickOne(sp.q)?.trim();
  return {
    genre: pickOne(sp.genre) as DanceGenre | undefined,
    region: pickOne(sp.region) as Region | undefined,
    status: pickOne(sp.status) as BattleStatus | undefined,
    q: q && q.length > 0 ? q : undefined,
  };
}

function pickOne(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export function applyFilters(battles: Battle[], f: BattleFilters): Battle[] {
  const q = f.q?.toLowerCase();
  return battles.filter((b) => {
    if (f.genre && !b.genres.includes(f.genre)) return false;
    if (f.region && b.venue.region !== f.region) return false;
    if (f.status && b.status !== f.status) return false;
    if (q) {
      const haystack = [
        b.title,
        b.subtitle,
        b.description,
        b.organizer,
        b.venue.name,
        b.venue.address,
        ...(b.tags ?? []),
        ...(b.judges ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function hasAnyFilter(f: BattleFilters): boolean {
  return Boolean(f.genre || f.region || f.status || f.q);
}

export function buildHref(current: BattleFilters, toggle: Partial<BattleFilters>): string {
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (v) next[k] = v;
  }
  for (const [k, v] of Object.entries(toggle)) {
    if (next[k] === v) {
      delete next[k];
    } else if (v) {
      next[k] = v;
    } else {
      delete next[k];
    }
  }
  const qs = new URLSearchParams(next).toString();
  return qs ? `/?${qs}` : "/";
}
