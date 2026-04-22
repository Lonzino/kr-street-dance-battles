import battlesJson from "@/data/battles.json";
import crewsJson from "@/data/crews.json";
import {
  type Battle,
  BattleArray,
  type BattleStatus,
  type Crew,
  CrewArray,
  type DanceGenre,
  type Region,
} from "@/schema";

const battles = BattleArray.parse(battlesJson);
const crews = CrewArray.parse(crewsJson);

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

export function getAllCrewSlugs(): string[] {
  return crews.map((c) => c.slug);
}

/**
 * 결과(results)에 이 크루가 등장하는 배틀들 반환.
 * 매칭은 크루 이름 또는 한글 이름 모두 시도.
 */
export function getBattlesByCrew(crew: Crew): { battle: Battle; rank: number }[] {
  const candidates = [crew.name, crew.koreanName].filter(Boolean) as string[];
  const matches: { battle: Battle; rank: number }[] = [];

  for (const b of battles) {
    if (!b.results) continue;
    for (const r of b.results) {
      if (!r.crew) continue;
      if (candidates.some((c) => r.crew?.toLowerCase() === c.toLowerCase())) {
        matches.push({ battle: b, rank: r.rank });
      }
    }
  }
  return matches.sort((a, b) => b.battle.date.localeCompare(a.battle.date));
}

/**
 * 배틀 결과 텍스트의 크루 이름이 등록된 크루와 매칭되면 slug 반환.
 */
export function findCrewSlugByName(name: string): string | undefined {
  const lower = name.toLowerCase();
  return crews.find((c) => c.name.toLowerCase() === lower || c.koreanName?.toLowerCase() === lower)
    ?.slug;
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
