import Link from "next/link";
import type { Battle } from "@/schema";
import {
  formatDateKR,
  formatKRW,
  formatLabel,
  genreLabel,
  regionLabel,
  statusColor,
  statusLabel,
} from "@/lib/labels";

export function BattleCard({ battle }: { battle: Battle }) {
  const topPrize = battle.prize?.[0];

  return (
    <Link
      href={`/battles/${battle.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5 transition-all hover:border-accent/50 hover:bg-muted/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[battle.status]}`}
          >
            {statusLabel[battle.status]}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateKR(battle.date, battle.endDate)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold leading-tight group-hover:text-accent">
          {battle.title}
        </h3>
        {battle.subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{battle.subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {battle.genres.map((g) => (
          <span
            key={g}
            className="rounded bg-foreground/10 px-2 py-0.5 text-foreground/90"
          >
            {genreLabel[g]}
          </span>
        ))}
        {battle.formats.map((f) => (
          <span
            key={f}
            className="rounded border border-border px-2 py-0.5 text-muted-foreground"
          >
            {formatLabel[f]}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {regionLabel[battle.venue.region]} · {battle.venue.name}
        </span>
        {topPrize?.amount && (
          <span className="font-medium text-accent">
            {formatKRW(topPrize.amount)}
          </span>
        )}
      </div>
    </Link>
  );
}
