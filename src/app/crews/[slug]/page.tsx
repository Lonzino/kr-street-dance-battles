import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCrewSlugs,
  getBattlesByCrew,
  getCrewBySlug,
} from "@/lib/data";
import {
  formatDateKR,
  genreLabel,
  regionLabel,
} from "@/lib/labels";

export async function generateStaticParams() {
  return getAllCrewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const crew = getCrewBySlug(slug);
  if (!crew) return { title: "크루를 찾을 수 없음" };
  return {
    title: crew.name,
    description: crew.description ?? `${crew.name} — ${regionLabel[crew.region]} 크루`,
  };
}

export default async function CrewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const crew = getCrewBySlug(slug);
  if (!crew) notFound();

  const battles = getBattlesByCrew(crew);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/crews"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← 모든 크루
      </Link>

      <header className="mb-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
            {crew.name}
          </h1>
          {crew.foundedYear && (
            <span className="text-sm text-muted-foreground">
              est. {crew.foundedYear}
            </span>
          )}
        </div>
        {crew.koreanName && (
          <p className="mt-1 text-base text-muted-foreground">{crew.koreanName}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">
            {regionLabel[crew.region]}
          </span>
          {crew.genres.map((g) => (
            <span key={g} className="rounded bg-foreground/10 px-2 py-0.5">
              {genreLabel[g]}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-8 sm:grid-cols-[1fr_240px]">
        <div className="space-y-8">
          {crew.description && (
            <Section title="소개">
              <p className="leading-relaxed text-foreground/90">{crew.description}</p>
            </Section>
          )}

          {battles.length > 0 && (
            <Section title="배틀 기록">
              <ul className="space-y-2">
                {battles.map(({ battle, rank }) => (
                  <li
                    key={battle.slug}
                    className="flex items-baseline gap-3 text-sm"
                  >
                    <span className="w-12 font-display text-accent">{rank}위</span>
                    <Link
                      href={`/battles/${battle.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {battle.title}
                    </Link>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDateKR(battle.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {crew.tags && crew.tags.length > 0 && (
            <Section title="태그">
              <div className="flex flex-wrap gap-1.5">
                {crew.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted/60 px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-4 text-sm">
          {crew.leader && (
            <SideBlock title="리더">
              <p>{crew.leader}</p>
            </SideBlock>
          )}
          {crew.members && crew.members.length > 0 && (
            <SideBlock title="멤버">
              <p className="leading-relaxed">{crew.members.join(", ")}</p>
            </SideBlock>
          )}
          {(crew.instagramUrl || crew.youtubeUrl) && (
            <SideBlock title="링크">
              <ul className="space-y-1.5">
                {crew.instagramUrl && (
                  <li>
                    <a
                      href={crew.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Instagram ↗
                    </a>
                  </li>
                )}
                {crew.youtubeUrl && (
                  <li>
                    <a
                      href={crew.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      YouTube ↗
                    </a>
                  </li>
                )}
              </ul>
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
