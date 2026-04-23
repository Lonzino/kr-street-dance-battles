import type { Metadata } from "next";
import Link from "next/link";
import { findCrewSlugByName, getAllBattles } from "@/lib/data";
import type { Battle } from "@/schema";

export const metadata: Metadata = {
  title: "랭킹",
  description: "최근 12개월 크루별 우승 집계",
};

export const dynamic = "force-dynamic";

interface CrewStats {
  crewName: string;
  crewSlug: string | null;
  wins: number;
  podium: number;
  finals: number;
  recentBattles: { title: string; slug: string; rank: number; date: string }[];
}

export default async function RankingPage() {
  const all = await getAllBattles();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recent = all.filter(
    (b) =>
      b.status === "finished" &&
      b.results &&
      b.results.length > 0 &&
      new Date(b.date) >= oneYearAgo,
  );

  const stats = await aggregateCrewStats(recent);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-5xl tracking-wide sm:text-6xl">랭킹</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          최근 12개월 종료된 배틀 결과 기준 · 우승 → TOP3 → 결승 진출 순으로 정렬
        </p>
      </header>

      {stats.length === 0 ? (
        <p className="rounded-xl border border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          아직 결과가 등록된 최근 배틀이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {stats.map((s, idx) => (
            <article
              key={`${s.crewName}-${idx}`}
              className="rounded-xl border border-border bg-muted/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-accent">{idx + 1}</span>
                  <div>
                    {s.crewSlug ? (
                      <Link href={`/crews/${s.crewSlug}`} className="font-bold hover:text-accent">
                        {s.crewName}
                      </Link>
                    ) : (
                      <span className="font-bold">{s.crewName}</span>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      우승 {s.wins} · TOP3 {s.podium} · 결승 진출 {s.finals}
                    </p>
                  </div>
                </div>
              </div>

              {s.recentBattles.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  {s.recentBattles.slice(0, 3).map((b) => (
                    <li key={b.slug}>
                      {b.date} · {b.rank}위 ·{" "}
                      <Link href={`/battles/${b.slug}`} className="hover:text-foreground">
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

async function aggregateCrewStats(battles: Battle[]): Promise<CrewStats[]> {
  const map = new Map<string, CrewStats>();

  for (const b of battles) {
    if (!b.results) continue;
    for (const r of b.results) {
      if (!r.crew) continue;
      const key = r.crew.toLowerCase().trim();
      let stat = map.get(key);
      if (!stat) {
        stat = {
          crewName: r.crew,
          crewSlug: null,
          wins: 0,
          podium: 0,
          finals: 0,
          recentBattles: [],
        };
        map.set(key, stat);
      }

      if (r.rank === 1) stat.wins++;
      if (r.rank <= 3) stat.podium++;
      if (r.rank <= 8) stat.finals++;

      stat.recentBattles.push({
        title: b.title,
        slug: b.slug,
        rank: r.rank,
        date: b.date,
      });
    }
  }

  // crew slug 매핑 일괄
  await Promise.all(
    Array.from(map.values()).map(async (s) => {
      s.crewSlug = (await findCrewSlugByName(s.crewName)) ?? null;
      s.recentBattles.sort((a, b) => b.date.localeCompare(a.date));
    }),
  );

  return Array.from(map.values()).sort(
    (a, b) =>
      b.wins - a.wins ||
      b.podium - a.podium ||
      b.finals - a.finals ||
      a.crewName.localeCompare(b.crewName),
  );
}
