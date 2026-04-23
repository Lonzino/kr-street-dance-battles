"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { getCurrentAuthUser } from "@/lib/supabase/server";

/**
 * 크루 클레임 신청 — source_records에 community_submission으로 기록.
 * admin queue에서 검토 후 수동으로 처리 (P3에선 별도 crew_claims 테이블 안 만듦, MVP 간소화).
 */
export async function submitCrewClaim(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login");
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const crewSlug = String(formData.get("crewSlug") ?? "").trim();
  const crewName = String(formData.get("crewName") ?? "").trim();
  const evidence = String(formData.get("evidence") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!crewSlug || !evidence) {
    return { ok: false, error: "크루 슬러그와 증빙 링크는 필수입니다." };
  }

  await getDb()
    .insert(schema.sourceRecords)
    .values({
      sourceType: "community_submission",
      sourceUrl: evidence,
      sourceId: `crew-claim-${crewSlug}-${authUser.id}`,
      rawContent: JSON.stringify({
        type: "crew_claim",
        crewSlug,
        crewName,
        userId: authUser.id,
        userEmail: authUser.email,
        evidence,
        note,
      }),
      status: "parsed",
      parseConfidence: 1,
      parseModel: "user-claim",
    })
    .onConflictDoUpdate({
      target: [schema.sourceRecords.sourceType, schema.sourceRecords.sourceId],
      set: {
        sourceUrl: evidence,
        rawContent: JSON.stringify({
          type: "crew_claim",
          crewSlug,
          crewName,
          userId: authUser.id,
          userEmail: authUser.email,
          evidence,
          note,
        }),
      },
    });

  return { ok: true };
}
