import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getNotificationPrefs } from "@/lib/notification-prefs";
import { getCurrentAuthUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { NotificationsForm } from "./notifications-form";

export const metadata: Metadata = {
  title: "알림 설정",
};

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-muted-foreground">로그인이 활성화되지 않았습니다.</p>
      </div>
    );
  }

  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile/notifications");

  const prefs = await getNotificationPrefs(authUser.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">알림 설정</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {authUser.email}로 발송 (다른 채널은 추후)
          </p>
        </div>
        <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
          ← 프로필
        </Link>
      </header>

      <NotificationsForm initial={prefs} />
    </div>
  );
}
