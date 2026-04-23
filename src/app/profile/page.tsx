import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { ensureUserRow, getUserProfile } from "@/lib/users";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "프로필",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile");

  // DB row 보장 (없으면 생성)
  await ensureUserRow(authUser.id, authUser.email, authUser.user_metadata?.avatar_url ?? null);
  const profile = await getUserProfile(authUser.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl tracking-wide">프로필</h1>
        <p className="mt-2 text-sm text-muted-foreground">{authUser.email}</p>
      </header>

      <nav className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ProfileLink href="/profile/bookmarks" label="북마크" />
        <ProfileLink href="/profile/notifications" label="알림 설정" />
        <ProfileLink href={`${SITE_URL}/calendar.ics`} label="캘린더 구독" external />
        <ProfileLink href="/profile" label="프로필 편집" active />
      </nav>

      <ProfileForm initial={profile} />
    </div>
  );
}

function ProfileLink({
  href,
  label,
  active,
  external,
}: {
  href: string;
  label: string;
  active?: boolean;
  external?: boolean;
}) {
  const className = `rounded-lg border px-3 py-2 text-center text-xs transition-colors ${
    active
      ? "border-accent bg-accent/10 text-accent"
      : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
  }`;

  if (external) {
    return (
      <a href={href} className={className} title="구독 후 캘린더에 자동 동기화">
        {label} ↗
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
