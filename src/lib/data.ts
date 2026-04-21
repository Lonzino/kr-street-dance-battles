import battlesJson from "@/data/battles.json";
import crewsJson from "@/data/crews.json";
import type { Battle, BattleStatus, Crew, DanceGenre, Region } from "@/types";

const battles = battlesJson as Battle[];
const crews = crewsJson as Crew[];

export function getAllBattles(): Battle[] {
  return [...battles].sort((a, b) => a.date.localeCompare(b.date));
}

export function getBattleBySlug(slug: string): Battle | undefined {
  return battles.find((b) => b.slug === slug);
}

export function getAllBattleSlugs(): string[] {
  return battles.map((b) => b.slug);
}

export function getAllCrews(): Crew[] {
  return [...crews].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCrewBySlug(slug: string): Crew | undefined {
  return crews.find((c) => c.slug === slug);
}

export function filterBattles(opts: {
  status?: BattleStatus;
  genre?: DanceGenre;
  region?: Region;
}): Battle[] {
  return getAllBattles().filter((b) => {
    if (opts.status && b.status !== opts.status) return false;
    if (opts.genre && !b.genres.includes(opts.genre)) return false;
    if (opts.region && b.venue.region !== opts.region) return false;
    return true;
  });
}
