import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/BookmarkButton";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getBookmarkedSlugs } from "@/lib/bookmarks";
import { findCrewSlugByName, getAllBattleSlugs, getBattleBySlug } from "@/lib/data";
import {
  formatDateKR,
  formatKRW,
  formatLabel,
  genreLabel,
  regionLabel,
  statusColor,
  statusLabel,
} from "@/lib/labels";
import { getCurrentAuthUser } from "@/lib/supabase/server";

export async function generateStaticParams() {
  const slugs = await getAllBattleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const battle = await getBattleBySlug(slug);
  if (!battle) return { title: "배틀을 찾을 수 없음" };
  return {
    title: battle.title,
    description: battle.description ?? battle.subtitle,
  };
}

export default async function BattleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const battle = await getBattleBySlug(slug);
  if (!battle) notFound();

  // 로그인된 사용자면 이 배틀이 북마크됐는지 확인 + 편집 권한 체크
  const authUser = await getCurrentAuthUser();
  const bookmarkedSet = authUser ? await getBookmarkedSlugs(authUser.id) : new Set<string>();
  const isBookmarked = bookmarkedSet.has(battle.slug);

  let canEdit = false;
  if (authUser && isDbConfigured()) {
    const [row] = await getDb()
      .select({ id: schema.battles.id })
      .from(schema.battles)
      .where(eq(schema.battles.slug, slug))
      .limit(1);
    if (row) {
      const ctx = await loadAuthzContext(authUser.id);
      canEdit = await canEditBattle(ctx, row.id);
    }
  }

  // results의 크루 이름 → slug 미리 일괄 조회 (렌더 중 async 회피)
  const crewSlugMap: Record<string, string | undefined> = {};
  if (battle.results) {
    await Promise.all(
      battle.results
        .map((r) => r.crew)
        .filter((name): name is string => Boolean(name))
        .map(async (name) => {
          crewSlugMap[name] = await findCrewSlugByName(name);
        }),
    );
  }

  // Schema.org Event status:
  // - cancelled: EventCancelled (전용 enum 있음)
  // - finished/ongoing/upcoming/registration: EventScheduled
  //   (Schema.org에 EventCompleted enum은 없음. Google은 endDate < now 보고 과거 이벤트로 처리)
  // 과거 이벤트도 JSON-LD 유지 — Google Knowledge Graph 및 검색 결과 보강.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DanceEvent",
    name: battle.title,
    description: battle.description ?? battle.subtitle ?? battle.title,
    startDate: battle.date,
    endDate: battle.endDate ?? battle.date,
    eventStatus:
      battle.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      battle.venue.region === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: battle.venue.name,
      address: battle.venue.address,
    },
    organizer: { "@type": "Organization", name: battle.organizer },
    // 과거 이벤트는 SoldOut, registration이면 InStock
    offers: battle.entryFee
      ? {
          "@type": "Offer",
          price: battle.entryFee,
          priceCurrency: "KRW",
          availability:
            battle.status === "registration"
              ? "https://schema.org/InStock"
              : battle.status === "finished" || battle.status === "ongoing"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/PreOrder",
        }
      : undefined,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← 전체 배틀 목록
      </Link>

      <header className="mb-8 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[battle.status]}`}
          >
            {statusLabel[battle.status]}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDateKR(battle.date, battle.endDate)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">{battle.title}</h1>
          <div className="flex items-center gap-2">
            {canEdit && (
              <Link
                href={`/battles/${battle.slug}/edit`}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
              >
                편집
              </Link>
            )}
            {authUser && (
              <BookmarkButton
                battleSlug={battle.slug}
                initialBookmarked={isBookmarked}
                variant="full"
              />
            )}
          </div>
        </div>
        {battle.subtitle && (
          <p className="mt-2 text-base text-muted-foreground">{battle.subtitle}</p>
        )}
      </header>

      {battle.posterUrl && (
        <div className="mb-8 overflow-hidden rounded-xl border border-border bg-muted/30">
          <Image
            src={battle.posterUrl}
            alt={`${battle.title} 포스터`}
            width={1200}
            height={1200}
            className="h-auto w-full"
            priority
          />
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          {battle.description && (
            <Section title="소개">
              <p className="leading-relaxed text-foreground/90">{battle.description}</p>
            </Section>
          )}

          <Section title="종목">
            <div className="flex flex-wrap gap-2">
              {battle.genres.map((g) => (
                <span key={g} className="rounded-md bg-foreground/10 px-3 py-1 text-sm">
                  {genreLabel[g]}
                </span>
              ))}
              {battle.formats.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {formatLabel[f]}
                </span>
              ))}
            </div>
          </Section>

          {battle.judges && battle.judges.length > 0 && (
            <Section title="심사위원">
              <p className="text-foreground/90">{battle.judges.join(" · ")}</p>
            </Section>
          )}

          {battle.prize && battle.prize.length > 0 && (
            <Section title="상금">
              <ul className="space-y-1.5">
                {battle.prize.map((p, idx) => (
                  <li key={idx} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{p.rank}</span>
                    <span className="font-medium">
                      {p.amount ? formatKRW(p.amount) : "—"}
                      {p.note && (
                        <span className="ml-2 text-xs text-muted-foreground">{p.note}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {battle.results && battle.results.length > 0 && (
            <Section title="결과">
              <ul className="space-y-1.5">
                {battle.results.map((r) => {
                  const name = r.crew ?? r.dancer ?? "";
                  const crewSlug = r.crew ? crewSlugMap[r.crew] : undefined;
                  return (
                    <li key={r.rank} className="flex items-baseline gap-3 text-sm">
                      <span className="w-8 font-display text-accent">{r.rank}위</span>
                      {crewSlug ? (
                        <Link href={`/crews/${crewSlug}`} className="font-medium hover:text-accent">
                          {name}
                        </Link>
                      ) : (
                        <span className="font-medium">{name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}
        </div>

        <aside className="space-y-6 text-sm">
          <SideBlock title="장소">
            <p className="font-medium">{battle.venue.name}</p>
            <p className="mt-0.5 text-muted-foreground">
              {regionLabel[battle.venue.region]} · {battle.venue.address}
            </p>
          </SideBlock>

          <SideBlock title="주최">
            <p>{battle.organizer}</p>
          </SideBlock>

          {battle.entryFee !== undefined && (
            <SideBlock title="참가비">
              <p>{formatKRW(battle.entryFee)}</p>
            </SideBlock>
          )}

          {battle.registrationDeadline && (
            <SideBlock title="접수 마감">
              <p>{formatDateKR(battle.registrationDeadline)}</p>
            </SideBlock>
          )}

          {battle.links.length > 0 && (
            <SideBlock title="링크">
              <ul className="space-y-1.5">
                {battle.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
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
