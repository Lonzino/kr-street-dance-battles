"use server";

import { revalidatePath } from "next/cache";
import { createRegistration } from "@/lib/registrations";

export async function submitRegistration(
  battleSlug: string,
  formData: FormData,
): Promise<{ ok: true; status: string } | { ok: false; error: string }> {
  const result = await createRegistration({
    categoryId: String(formData.get("categoryId") ?? ""),
    partnerName: String(formData.get("partnerName") ?? "").trim() || undefined,
    crewName: String(formData.get("crewName") ?? "").trim() || undefined,
    note: String(formData.get("note") ?? "").trim() || undefined,
  });

  if (!result.ok) return result;

  revalidatePath(`/battles/${battleSlug}/register`);
  revalidatePath(`/battles/${battleSlug}/admin`);
  revalidatePath("/profile");

  return { ok: true, status: result.status };
}
