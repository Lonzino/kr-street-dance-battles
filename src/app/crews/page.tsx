import Link from "next/link";
import type { Metadata } from "next";
import { getAllCrews } from "@/lib/data";
import { genreLabel, regionLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "크루",
  description: "한국 스트릿 댄스 크루 디렉토리",
};

export default function CrewsPage() {
  const crews = getAllCrews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wide sm:text-6xl">크루</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          국내 활동 스트릿 댄스 크루 디렉토리
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crews.map((crew) => (
          <Link
            key={crew.slug}
            href={`/crews/${crew.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-muted/30 p-5 transition-all hover:border-accent/50 hover:bg-muted/60"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold group-hover:text-accent">
                {crew.name}
              </h2>
              {crew.foundedYear && (
                <span className="text-xs text-muted-foreground">{crew.foundedYear}</span>
              )}
            </div>
            {crew.koreanName && (
              <p className="text-sm text-muted-foreground">{crew.koreanName}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">
                {regionLabel[crew.region]}
              </span>
              {crew.genres.map((g) => (
                <span
                  key={g}
                  className="rounded bg-foreground/10 px-2 py-0.5"
                >
                  {genreLabel[g]}
                </span>
              ))}
            </div>
            {crew.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/80">
                {crew.description}
              </p>
            )}
          </Link>
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        크루 등록 제보는{" "}
        <a
          href="https://github.com/Lonzino/kr-street-dance-battles/issues"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          GitHub Issues
        </a>
        로
      </p>
    </div>
  );
}
