import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCrewBySlug } from "@/lib/data";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { ClaimCrewForm } from "./claim-form";

export const metadata: Metadata = {
  title: "크루 클레임",
};

export const dynamic = "force-dynamic";

export default async function ClaimCrewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect(`/login?next=/crews/${slug}/claim`);

  const crew = await getCrewBySlug(slug);
  if (!crew) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href={`/crews/${slug}`}
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {crew.name}
        </Link>
        <h1 className="font-display text-4xl tracking-wide">크루 클레임</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {crew.name}의 멤버임을 증명하면 크루 정보를 직접 관리할 수 있습니다.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
        <p className="font-bold">증명 방법</p>
        <p className="mt-1.5 leading-relaxed">
          크루 공식 인스타그램에서 본인 계정을 멘션한 게시물 또는 멤버 명단에 본인 이름이 포함된
          사진 등을 제출해주세요. 운영자가 1~3일 내 검토합니다.
        </p>
      </div>

      <ClaimCrewForm crewSlug={slug} crewName={crew.name} />
    </div>
  );
}
