import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

      <ProfileForm initial={profile} />
    </div>
  );
}
