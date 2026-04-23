import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDancerNicknames, getDancerByNickname } from "@/lib/dancers";
import { getAllBattles } from "@/lib/data";
import { formatDateKR, genreLabel, regionLabel } from "@/lib/labels";
import { getRegistrationsForUser } from "@/lib/registrations";

export async function generateStaticParams() {
  const nicknames = await getAllDancerNicknames();
  return nicknames.map((nickname) => ({ nickname }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nickname: string }>;
}): Promise<Metadata> {
  const { nickname } = await params;
  const d = await getDancerByNickname(decodeURIComponent(nickname));
  if (!d) return { title: "댄서를 찾을 수 없음" };
  return {
    title: d.nickname ?? "댄서",
    description: d.bio ?? `${d.nickname} — ${d.region ? regionLabel[d.region] : ""} 댄서`,
  };
}

export const dynamic = "force-dynamic";

export default async function DancerProfilePage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;
  const dancer = await getDancerByNickname(decodeURIComponent(nickname));
  if (!dancer) notFound();

  // 결과에 등장한 배틀
  const allBattles = await getAllBattles();
  const lowerNick = (dancer.nickname ?? "").toLowerCase();
  const wonBattles: Array<{ slug: string; title: string; date: string; rank: number }> = [];
  for (const b of allBattles) {
    if (!b.results) continue;
    for (const r of b.results) {
      if (r.dancer && r.dancer.toLowerCase().trim() === lowerNick) {
        wonBattles.push({ slug: b.slug, title: b.title, date: b.date, rank: r.rank });
      }
    }
  }
  wonBattles.sort((a, b) => b.date.localeCompare(a.date));

  // 참가 신청 기록 (본인 외에는 confirmed/checked_in만)
  const allRegs = await getRegistrationsForUser(dancer.id);
  const publicRegs = allRegs.filter(
    (r) => r.registration.status === "confirmed" || r.registration.status === "checked_in",
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/dancers"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← 모든 댄서
      </Link>

      <header className="mb-8 border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
            {dancer.nickname?.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-wide sm:text-5xl">{dancer.nickname}</h1>
            {dancer.region && (
              <p className="mt-1 text-sm text-muted-foreground">{regionLabel[dancer.region]}</p>
            )}
          </div>
        </div>

        {dancer.primaryGenres && dancer.primaryGenres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {dancer.primaryGenres.map((g) => (
              <span key={g} className="rounded bg-foreground/10 px-2 py-0.5">
                {genreLabel[g]}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-8 sm:grid-cols-[1fr_240px]">
        <div className="space-y-8">
          {dancer.bio && (
            <Section title="소개">
              <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{dancer.bio}</p>
            </Section>
          )}

          {wonBattles.length > 0 && (
            <Section title="배틀 기록">
              <ul className="space-y-2">
                {wonBattles.map((b) => (
                  <li key={`${b.slug}-${b.rank}`} className="flex items-baseline gap-3 text-sm">
                    <span className="w-12 font-display text-accent">{b.rank}위</span>
                    <Link href={`/battles/${b.slug}`} className="font-medium hover:text-accent">
                      {b.title}
                    </Link>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDateKR(b.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {publicRegs.length > 0 && (
            <Section title="참가">
              <ul className="space-y-2">
                {publicRegs.slice(0, 10).map((r) => (
                  <li key={r.registration.id} className="flex items-baseline gap-3 text-sm">
                    <span className="text-xs text-muted-foreground">{r.battle.date}</span>
                    <Link
                      href={`/battles/${r.battle.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {r.battle.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">· {r.category.name}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <aside className="space-y-4 text-sm">
          {dancer.instagramHandle && (
            <SideBlock title="인스타그램">
              <a
                href={`https://instagram.com/${dancer.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                @{dancer.instagramHandle} ↗
              </a>
            </SideBlock>
          )}
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
