import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { getCategoriesForBattle } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { getBattleBySlug } from "@/lib/data";
import { getRegistrationsForCategory } from "@/lib/registrations";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { CategoriesPanel } from "./categories-panel";
import { CheckInScanner } from "./check-in-scanner";
import { RegistrationsPanel } from "./registrations-panel";

export const metadata: Metadata = {
  title: "주최자 명단 관리",
};

export const dynamic = "force-dynamic";

export default async function BattleAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSupabaseConfigured() || !isDbConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">관리 기능이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect(`/login?next=/battles/${slug}/admin`);

  const battle = await getBattleBySlug(slug);
  if (!battle) notFound();

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
        <p className="mt-3 text-sm text-muted-foreground">이 배틀의 주최자만 접근 가능합니다.</p>
      </div>
    );
  }

  const categories = await getCategoriesForBattle(row.id);

  // 카테고리별 신청 일괄 조회
  const registrationsByCategory = await Promise.all(
    categories.map(async (c) => ({
      category: c,
      registrations: await getRegistrationsForCategory(c.id),
    })),
  );

  const registerUrl = `${SITE_URL}/battles/${slug}/register`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <Link
          href={`/battles/${slug}`}
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {battle.title}
        </Link>
        <h1 className="font-display text-3xl tracking-wide">주최자 관리</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          참가 부문 추가, 신청자 검토, 결과 입력, 현장 체크인.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs">
          <p className="text-muted-foreground">참가 신청 URL (참가자에게 공유):</p>
          <code className="mt-1 block break-all text-accent">{registerUrl}</code>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-3 text-xl font-bold">참가 부문</h2>
        <CategoriesPanel battleId={row.id} battleSlug={slug} categories={categories} />
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-xl font-bold">신청자 명단</h2>
        {registrationsByCategory.length === 0 ? (
          <p className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            먼저 위에서 참가 부문을 추가하세요.
          </p>
        ) : (
          <div className="space-y-6">
            {registrationsByCategory.map(({ category, registrations }) => (
              <RegistrationsPanel
                key={category.id}
                battleId={row.id}
                battleSlug={slug}
                category={category}
                registrations={registrations}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">현장 체크인</h2>
        <CheckInScanner battleId={row.id} battleSlug={slug} />
      </section>
    </div>
  );
}
