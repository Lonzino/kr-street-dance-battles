"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveNotificationPrefs } from "@/lib/notification-prefs";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import type { DanceGenre, Region } from "@/schema";

export async function savePrefs(formData: FormData): Promise<{ error?: string }> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile/notifications");

  const channels = formData.getAll("channels").map(String);
  const regions = formData.getAll("regions").map(String) as Region[];
  const genres = formData.getAll("genres").map(String) as DanceGenre[];
  const leadDays = Number(formData.get("leadDays") ?? 3);
  const weeklyDigest = formData.get("weeklyDigest") === "on";
  const bookmarkAlerts = formData.get("bookmarkAlerts") === "on";

  const result = await saveNotificationPrefs(authUser.id, {
    channels: channels.length > 0 ? channels : ["email"],
    regions: regions.length > 0 ? regions : null,
    genres: genres.length > 0 ? genres : null,
    leadDays,
    weeklyDigest,
    bookmarkAlerts,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/profile/notifications");
  return {};
}
