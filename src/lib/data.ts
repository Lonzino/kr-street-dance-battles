import { and, asc, eq } from "drizzle-orm";
import battlesJson from "@/data/battles.json";
import crewsJson from "@/data/crews.json";
import { getDb, isDbConfigured, schema } from "@/db/client";
import {
  type Battle,
  BattleArray,
  type BattleStatus,
  type Crew,
  CrewArray,
  type DanceGenre,
  type Region,
} from "@/schema";

/**
 * 데이터 액세스 레이어.
 *
 * DB가 연결돼있으면 (DATABASE_URL 설정) DB 우선, 아니면 JSON fallback.
 * 운영자가 admin에서 승인한 데이터는 DB의 battles 테이블에 isPublished=true로 저장됨.
 *
 * JSON fallback은 (1) 초기 개발 (2) DB 일시 장애 (3) 시드 검증용.
 *
 * 모든 함수가 async — generateStaticParams, sitemap.ts, page.tsx 등 모든 호출부에서 await 필요.
 */

const battlesFromJson = BattleArray.parse(battlesJson);
const crewsFromJson = CrewArray.parse(crewsJson);

// ────────────────────────────────────────────────
// DB row → Battle 타입 변환
// ────────────────────────────────────────────────

type BattleRow = typeof schema.battles.$inferSelect;
type CrewRow = typeof schema.crews.$inferSelect;

function rowToBattle(r: BattleRow): Battle {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    description: r.description ?? undefined,
    date: r.date,
    endDate: r.endDate ?? undefined,
    registrationDeadline: r.registrationDeadline ?? undefined,
    genres: r.genres as DanceGenre[],
    formats: r.formats as Battle["formats"],
    status: r.status as BattleStatus,
    venue: r.venue,
    organizer: r.organizer,
    judges: r.judges ?? undefined,
    prize: r.prize ?? undefined,
    entryFee: r.entryFee ?? undefined,
    posterUrl: r.posterUrl ?? undefined,
    links: r.links ?? [],
    results: r.results ?? undefined,
    tags: r.tags ?? undefined,
  };
}

function rowToCrew(r: CrewRow): Crew {
  return {
    slug: r.slug,
    name: r.name,
    koreanName: r.koreanName ?? undefined,
    aliases: r.aliases ?? undefined,
    foundedYear: r.foundedYear ?? undefined,
    region: r.region as Region,
    genres: r.genres as DanceGenre[],
    leader: r.leader ?? undefined,
    members: r.members ?? undefined,
    description: r.description ?? undefined,
    instagramUrl: r.instagramUrl ?? undefined,
    youtubeUrl: r.youtubeUrl ?? undefined,
    tags: r.tags ?? undefined,
  };
}

function crewMatchCandidates(c: Crew): string[] {
  return [c.name, c.koreanName, ...(c.aliases ?? [])]
    .filter(Boolean)
    .map((s) => (s as string).toLowerCase().trim());
}

// ────────────────────────────────────────────────
// 배틀
// ────────────────────────────────────────────────

export async function getAllBattles(): Promise<Battle[]> {
  if (isDbConfigured()) {
    const rows = await getDb()
      .select()
      .from(schema.battles)
      .where(eq(schema.battles.isPublished, true))
      .orderBy(asc(schema.battles.date));
    return rows.map(rowToBattle);
  }
  return [...battlesFromJson].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getBattleBySlug(slug: string): Promise<Battle | undefined> {
  if (isDbConfigured()) {
    const [row] = await getDb()
      .select()
      .from(schema.battles)
      .where(and(eq(schema.battles.slug, slug), eq(schema.battles.isPublished, true)))
      .limit(1);
    return row ? rowToBattle(row) : undefined;
  }
  return battlesFromJson.find((b) => b.slug === slug);
}

export async function getAllBattleSlugs(): Promise<string[]> {
  if (isDbConfigured()) {
    const rows = await getDb()
      .select({ slug: schema.battles.slug })
      .from(schema.battles)
      .where(eq(schema.battles.isPublished, true));
    return rows.map((r) => r.slug);
  }
  return battlesFromJson.map((b) => b.slug);
}

// ────────────────────────────────────────────────
// 크루
// ────────────────────────────────────────────────

export async function getAllCrews(): Promise<Crew[]> {
  if (isDbConfigured()) {
    const rows = await getDb().select().from(schema.crews).orderBy(asc(schema.crews.name));
    return rows.map(rowToCrew);
  }
  return [...crewsFromJson].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCrewBySlug(slug: string): Promise<Crew | undefined> {
  if (isDbConfigured()) {
    const [row] = await getDb()
      .select()
      .from(schema.crews)
      .where(eq(schema.crews.slug, slug))
      .limit(1);
    return row ? rowToCrew(row) : undefined;
  }
  return crewsFromJson.find((c) => c.slug === slug);
}

export async function getAllCrewSlugs(): Promise<string[]> {
  if (isDbConfigured()) {
    const rows = await getDb().select({ slug: schema.crews.slug }).from(schema.crews);
    return rows.map((r) => r.slug);
  }
  return crewsFromJson.map((c) => c.slug);
}

/**
 * 결과(results)에 이 크루가 등장하는 배틀들 반환 (최신순).
 * 매칭은 크루 이름 / 한글 이름 / aliases 배열 (대소문자·앞뒤 공백 무시).
 */
export async function getBattlesByCrew(crew: Crew): Promise<{ battle: Battle; rank: number }[]> {
  const lowered = crewMatchCandidates(crew);
  const all = await getAllBattles();

  const matches: { battle: Battle; rank: number }[] = [];
  for (const b of all) {
    if (!b.results) continue;
    for (const r of b.results) {
      if (!r.crew) continue;
      if (lowered.includes(r.crew.toLowerCase().trim())) {
        matches.push({ battle: b, rank: r.rank });
      }
    }
  }
  return matches.sort((a, b) => b.battle.date.localeCompare(a.battle.date));
}

/**
 * 배틀 결과 텍스트의 크루 이름이 등록된 크루와 매칭되면 slug 반환.
 * battles/[slug] 페이지에서 결과를 크루 페이지로 링크할 때 사용.
 * name / koreanName / aliases 배열 모두 후보로.
 */
export async function findCrewSlugByName(name: string): Promise<string | undefined> {
  const lower = name.toLowerCase().trim();
  const crews = await getAllCrews();
  return crews.find((c) => crewMatchCandidates(c).includes(lower))?.slug;
}

// ────────────────────────────────────────────────
// 필터 (서버 사이드 — DB 조회 시 인덱스 활용)
// ────────────────────────────────────────────────

export async function filterBattles(opts: {
  status?: BattleStatus;
  genre?: DanceGenre;
  region?: Region;
}): Promise<Battle[]> {
  const all = await getAllBattles();
  return all.filter((b) => {
    if (opts.status && b.status !== opts.status) return false;
    if (opts.genre && !b.genres.includes(opts.genre)) return false;
    if (opts.region && b.venue.region !== opts.region) return false;
    return true;
  });
}

export const _internal = { battlesFromJson, crewsFromJson };
