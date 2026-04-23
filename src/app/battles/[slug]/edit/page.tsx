import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getBattleBySlug } from "@/lib/data";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { EditBattleForm } from "./edit-form";

export const metadata: Metadata = {
  title: "배틀 편집",
};

export const dynamic = "force-dynamic";

export default async function EditBattlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSupabaseConfigured() || !isDbConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">편집 기능이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect(`/login?next=/battles/${slug}/edit`);

  const battle = await getBattleBySlug(slug);
  if (!battle) notFound();

  // battle.id 조회 (Battle 타입엔 id 없음)
  const [row] = await getDb()
    .select({ id: schema.battles.id })
    .from(schema.battles)
    .where(eq(schema.battles.slug, slug))
    .limit(1);

  if (!row) notFound();

  const ctx = await loadAuthzContext(authUser.id);
  const allowed = await canEditBattle(ctx, row.id);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">권한 없음</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          이 배틀을 편집할 권한이 없습니다. 본인이 주최자라면{" "}
          <Link href={`/battles/${slug}`} className="underline">
            배틀 페이지
          </Link>
          에서 클레임을 신청해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href={`/battles/${slug}`}
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← 배틀 페이지
        </Link>
        <h1 className="font-display text-4xl tracking-wide">배틀 편집</h1>
        <p className="mt-2 text-sm text-muted-foreground">{battle.title}</p>
      </header>

      <EditBattleForm battleSlug={slug} battleId={row.id} initial={battle} />
    </div>
  );
}
