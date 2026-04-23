import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { LoginButtons } from "./login-buttons";

export const metadata: Metadata = {
  title: "로그인",
  description: "카카오 또는 구글 계정으로 로그인",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
          소셜 로그인이 아직 설정되지 않았습니다. 운영자에게 문의하세요.
        </p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (authUser) redirect(sp.next?.startsWith("/") ? sp.next : "/profile");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="font-display text-3xl tracking-wide">로그인</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        북마크·알림·셀프 등록은 로그인이 필요해요.
      </p>

      <div className="mt-8 space-y-3">
        <LoginButtons next={sp.next} />
      </div>

      {sp.error && (
        <p className="mt-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {sp.error === "no_code" ? "OAuth 응답에 code가 없습니다." : sp.error}
        </p>
      )}

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        로그인하면{" "}
        <a href="/terms" className="underline hover:text-foreground">
          이용약관
        </a>{" "}
        및{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          개인정보처리방침
        </a>
        에 동의한 것으로 간주합니다.
      </p>
    </div>
  );
}
