import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadAuthzContext } from "@/lib/authz";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { SubmitBattleForm } from "./submit-form";

export const metadata: Metadata = {
  title: "배틀 제보",
  description: "배틀 정보를 직접 등록하세요.",
};

export const dynamic = "force-dynamic";

export default async function SubmitBattlePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/submit/battle");

  const ctx = await loadAuthzContext(authUser.id);
  const instant = ctx.role === "admin" || (ctx.approvedSubmissions ?? 0) >= 3;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← 전체 배틀
        </Link>
        <h1 className="font-display text-4xl tracking-wide">배틀 제보</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {instant
            ? "검증된 주최자입니다. 등록 즉시 사이트에 게시됩니다."
            : "등록 후 운영자 검토를 거쳐 게시됩니다 (보통 24시간 이내)."}
        </p>
      </header>

      <SubmitBattleForm instant={instant} />
    </div>
  );
}
