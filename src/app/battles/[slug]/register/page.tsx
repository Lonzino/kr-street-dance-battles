import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { getCategoriesForBattle } from "@/lib/categories";
import { getBattleBySlug } from "@/lib/data";
import { formatDateKR } from "@/lib/labels";
import { getRegistrationsForUser } from "@/lib/registrations";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "참가 신청",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSupabaseConfigured() || !isDbConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">참가 신청 기능이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect(`/login?next=/battles/${slug}/register`);

  const battle = await getBattleBySlug(slug);
  if (!battle) notFound();

  // battle.id 조회 (Battle 타입엔 id 없음)
  const [row] = await getDb()
    .select({ id: schema.battles.id })
    .from(schema.battles)
    .where(eq(schema.battles.slug, slug))
    .limit(1);
  if (!row) notFound();

  const categories = await getCategoriesForBattle(row.id);

  // 사용자가 이미 신청한 카테고리
  const myRegs = await getRegistrationsForUser(authUser.id);
  const registeredCategoryIds = new Set(
    myRegs
      .filter((r) => r.battle.slug === slug && r.registration.status !== "cancelled")
      .map((r) => r.category.id),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href={`/battles/${slug}`}
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {battle.title}
        </Link>
        <h1 className="font-display text-4xl tracking-wide">참가 신청</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDateKR(battle.date, battle.endDate)} · {battle.venue.name}
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-200">
          <p className="font-bold">아직 신청 부문이 등록되지 않았습니다.</p>
          <p className="mt-2">주최자가 부문을 추가한 후 신청 가능합니다.</p>
        </div>
      ) : (
        <RegisterForm
          battleSlug={slug}
          categories={categories}
          registeredCategoryIds={Array.from(registeredCategoryIds)}
        />
      )}
    </div>
  );
}
