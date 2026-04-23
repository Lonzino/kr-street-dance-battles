import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BattleCard } from "@/components/BattleCard";
import { getBookmarkedBattles } from "@/lib/bookmarks";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "북마크",
};

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile/bookmarks");

  const battles = await getBookmarkedBattles(authUser.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">북마크</h1>
          <p className="mt-2 text-sm text-muted-foreground">총 {battles.length}건</p>
        </div>
        <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
          ← 프로필
        </Link>
      </header>

      {battles.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-10 text-center">
          <p className="text-sm text-muted-foreground">아직 북마크한 배틀이 없습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-xs font-bold text-black hover:opacity-90"
          >
            배틀 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {battles.map((b) => (
            <BattleCard key={b.slug} battle={b} bookmarked showBookmark />
          ))}
        </div>
      )}
    </div>
  );
}
