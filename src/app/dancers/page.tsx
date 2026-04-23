import type { Metadata } from "next";
import Link from "next/link";
import { getAllDancers } from "@/lib/dancers";
import { genreLabel, regionLabel } from "@/lib/labels";

export const metadata: Metadata = {
  title: "댄서",
  description: "한국 스트릿 댄스 씬 댄서 디렉토리",
};

export const dynamic = "force-dynamic";

export default async function DancersPage() {
  const dancers = await getAllDancers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wide sm:text-6xl">댄서</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          닉네임을 설정한 회원이 자동으로 노출됩니다.
        </p>
      </header>

      {dancers.length === 0 ? (
        <p className="rounded-xl border border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          아직 등록된 댄서가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dancers.map((d) => (
            <Link
              key={d.id}
              href={`/dancers/${d.nickname}`}
              className="group flex flex-col rounded-xl border border-border bg-muted/30 p-5 transition-all hover:border-accent/50 hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-bold text-accent">
                  {d.nickname?.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold group-hover:text-accent">{d.nickname}</p>
                  {d.region && (
                    <p className="text-xs text-muted-foreground">{regionLabel[d.region]}</p>
                  )}
                </div>
              </div>

              {d.primaryGenres && d.primaryGenres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {d.primaryGenres.map((g) => (
                    <span key={g} className="rounded bg-foreground/10 px-2 py-0.5">
                      {genreLabel[g]}
                    </span>
                  ))}
                </div>
              )}

              {d.bio && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/80">
                  {d.bio}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
