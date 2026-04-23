import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { DeleteAccountForm } from "./delete-form";

export const metadata: Metadata = {
  title: "회원 탈퇴",
};

export const dynamic = "force-dynamic";

export default async function DeleteAccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile/delete-account");

  const adminAvailable = isSupabaseAdminConfigured();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <Link
          href="/profile"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← 프로필
        </Link>
        <h1 className="font-display text-4xl tracking-wide">회원 탈퇴</h1>
        <p className="mt-2 text-sm text-muted-foreground">{authUser.email}</p>
      </header>

      <section className="space-y-4 rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-sm">
        <p className="font-bold text-red-300">탈퇴 시 즉시 삭제되는 정보</p>
        <ul className="list-disc space-y-1 pl-5 text-foreground/85">
          <li>프로필 (닉네임·소개·지역·장르·인스타 핸들)</li>
          <li>북마크 전체</li>
          <li>알림 설정</li>
          <li>주최자 클레임 권한</li>
        </ul>

        <p className="mt-4 font-bold text-amber-300">익명화 후 보존되는 정보</p>
        <ul className="list-disc space-y-1 pl-5 text-foreground/85">
          <li>등록한 배틀 정보 (서비스 무결성 유지) — 등록자 ID는 익명 해시로 교체</li>
          <li>편집 이력 (감사용) — 사용자 ID null 처리</li>
        </ul>

        {!adminAvailable && (
          <p className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
            ⚠️ Supabase Auth 자동 삭제 미설정 (SUPABASE_SERVICE_ROLE_KEY).
            <br />
            DB 데이터는 즉시 삭제되지만, 로그인 정보는 운영자가 Supabase Dashboard에서 별도
            삭제합니다.
          </p>
        )}
      </section>

      <div className="mt-8">
        <DeleteAccountForm email={authUser.email ?? ""} />
      </div>
    </div>
  );
}
