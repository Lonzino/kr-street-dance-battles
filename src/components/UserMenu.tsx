import Link from "next/link";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/users";

/**
 * 헤더 우측 사용자 메뉴.
 * - Supabase 미설정: 아무것도 렌더 안 함
 * - 비로그인: "로그인" 링크
 * - 로그인: 닉네임/이메일 + 프로필 링크
 */
export async function UserMenu() {
  if (!isSupabaseConfigured()) return null;

  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return (
      <Link
        href="/login"
        className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
      >
        로그인
      </Link>
    );
  }

  const profile = await getUserProfile(authUser.id);
  const displayName = profile?.nickname ?? authUser.email?.split("@")[0] ?? "사용자";

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs hover:border-accent"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
        {displayName.slice(0, 1).toUpperCase()}
      </span>
      <span className="max-w-[120px] truncate">{displayName}</span>
    </Link>
  );
}
