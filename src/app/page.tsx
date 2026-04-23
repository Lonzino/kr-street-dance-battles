import { BattleCard } from "@/components/BattleCard";
import { FilterBar } from "@/components/FilterBar";
import { getAllBattles } from "@/lib/data";
import { applyFilters, hasAnyFilter, parseFilters } from "@/lib/filters";
import type { Battle, BattleStatus } from "@/schema";

const GROUPS: { status: BattleStatus | "active"; title: string; desc?: string }[] = [
  { status: "active", title: "지금 진행중·접수중", desc: "참가 신청이 열려있거나 곧 열리는 배틀" },
  { status: "upcoming", title: "예정된 배틀" },
  { status: "finished", title: "지난 배틀 아카이브" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const filtersActive = hasAnyFilter(filters);

  const all = await getAllBattles();
  const filtered = applyFilters(all, filters);
  const now = new Date();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10">
        <h1 className="font-display text-5xl tracking-wide sm:text-7xl">
          한국 스트릿 댄스
          <br />
          <span className="text-accent">배틀 아카이브</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          전국에서 열리는 비보잉·팝핑·락킹·왁킹·힙합·하우스 배틀 일정과 결과를 한 곳에서.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Stat label="전체 배틀" value={all.length} />
          <Stat
            label="접수중·진행중"
            value={all.filter((b) => b.status === "registration" || b.status === "ongoing").length}
            highlight
          />
          <Stat
            label="예정"
            value={all.filter((b) => b.status === "upcoming" && new Date(b.date) >= now).length}
          />
        </div>
      </section>

      <section className="mb-8">
        <FilterBar current={filters} />
      </section>

      {filtersActive ? (
        <FilteredList battles={filtered} totalCount={all.length} />
      ) : (
        <GroupedList battles={all} now={now} />
      )}
    </div>
  );
}

function FilteredList({ battles, totalCount }: { battles: Battle[]; totalCount: number }) {
  return (
    <section>
      <header className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">검색 결과</h2>
        <span className="text-xs text-muted-foreground">
          {battles.length} / {totalCount}건
        </span>
      </header>
      {battles.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          조건에 맞는 배틀이 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {battles.map((b) => (
            <BattleCard key={b.slug} battle={b} />
          ))}
        </div>
      )}
    </section>
  );
}

function GroupedList({ battles, now }: { battles: Battle[]; now: Date }) {
  const active = battles.filter((b) => b.status === "registration" || b.status === "ongoing");
  const upcoming = battles
    .filter((b) => b.status === "upcoming" && new Date(b.date) >= now)
    .slice(0, 12);
  const finished = battles
    .filter((b) => b.status === "finished")
    .reverse()
    .slice(0, 6);

  const groupMap: Record<string, Battle[]> = { active, upcoming, finished };

  return (
    <>
      {GROUPS.map((group) => {
        const items = groupMap[group.status];
        if (!items || items.length === 0) return null;
        return (
          <section key={group.status} className="mb-14">
            <header className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{group.title}</h2>
                {group.desc && <p className="mt-1 text-xs text-muted-foreground">{group.desc}</p>}
              </div>
              <span className="text-xs text-muted-foreground">{items.length}건</span>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((b) => (
                <BattleCard key={b.slug} battle={b} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        highlight ? "border-accent/40 bg-accent/10 text-accent" : "border-border bg-muted/30"
      }`}
    >
      <span className="mr-2 text-[10px] uppercase tracking-wider">{label}</span>
      <span className="text-base font-bold">{value}</span>
    </div>
  );
}
