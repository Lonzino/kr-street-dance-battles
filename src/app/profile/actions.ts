"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import { updateUserProfile } from "@/lib/users";
import type { DanceGenre, Region } from "@/schema";

function pickGenres(formData: FormData): DanceGenre[] {
  const all = formData.getAll("primaryGenres").map(String) as DanceGenre[];
  return Array.from(new Set(all)).slice(0, 5);
}

export async function saveProfile(formData: FormData): Promise<{ error?: string }> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/profile");

  const nickname = String(formData.get("nickname") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const region = (String(formData.get("region") ?? "").trim() || null) as Region | null;
  const instagramHandle =
    String(formData.get("instagramHandle") ?? "")
      .trim()
      .replace(/^@/, "") || null;
  const primaryGenres = pickGenres(formData);

  const result = await updateUserProfile(authUser.id, {
    nickname,
    bio,
    region,
    instagramHandle,
    primaryGenres: primaryGenres.length > 0 ? primaryGenres : null,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/profile");
  return {};
}
