import Link from "next/link";
import { type BattleFilters, buildHref, hasAnyFilter } from "@/lib/filters";
import {
  genreLabel,
  regionLabel,
  statusLabel,
} from "@/lib/labels";
import type { BattleStatus, DanceGenre, Region } from "@/schema";

const GENRE_OPTIONS: DanceGenre[] = [
  "bboying",
  "popping",
  "locking",
  "hiphop",
  "house",
  "krump",
  "waacking",
  "voguing",
  "allstyle",
  "mixed",
];

const STATUS_OPTIONS: BattleStatus[] = ["registration", "upcoming", "finished"];

const REGION_OPTIONS: Region[] = [
  "seoul",
  "gyeonggi",
  "incheon",
  "busan",
  "daegu",
  "daejeon",
  "gwangju",
  "ulsan",
  "gangwon",
  "jeonbuk",
  "jeonnam",
  "jeju",
  "online",
];

export function FilterBar({ current }: { current: BattleFilters }) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
      <FilterRow label="상태">
        {STATUS_OPTIONS.map((s) => (
          <Chip
            key={s}
            href={buildHref(current, { status: s })}
            active={current.status === s}
          >
            {statusLabel[s]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="장르">
        {GENRE_OPTIONS.map((g) => (
          <Chip
            key={g}
            href={buildHref(current, { genre: g })}
            active={current.genre === g}
          >
            {genreLabel[g]}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="지역">
        {REGION_OPTIONS.map((r) => (
          <Chip
            key={r}
            href={buildHref(current, { region: r })}
            active={current.region === r}
          >
            {regionLabel[r]}
          </Chip>
        ))}
      </FilterRow>

      {hasAnyFilter(current) && (
        <div className="border-t border-border pt-3">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← 모든 필터 해제
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1.5 w-10 shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-accent bg-accent text-black"
          : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
