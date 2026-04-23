"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { loadAuthzContext } from "@/lib/authz";
import { getCurrentAuthUser } from "@/lib/supabase/server";

/**
 * 사용자 셀프 등록 — 두 가지 흐름:
 * 1. 일반 사용자 / 신규: source_records에 community_submission으로 → admin queue
 * 2. 검증된 주최자(admin / approvedSubmissions ≥ 3): 즉시 published battles 생성
 *
 * source_records.parsedPayload에 입력값을 그대로 저장 (LLM 파싱 스킵).
 */
export async function submitBattle(
  formData: FormData,
): Promise<{ ok: true; status: "queued" | "published" } | { ok: false; error: string }> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) redirect("/login?next=/submit/battle");
  if (!isDbConfigured()) return { ok: false, error: "DB가 연결되지 않았습니다." };

  const ctx = await loadAuthzContext(authUser.id);
  const instant = ctx.role === "admin" || (ctx.approvedSubmissions ?? 0) >= 3;

  // 입력 추출 — 최소 필드만 폼에서 받고 나머지는 admin이 보완
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const region = String(formData.get("region") ?? "seoul").trim();
  const organizer = String(formData.get("organizer") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();

  if (!title || !date || !venue || !organizer) {
    return { ok: false, error: "제목·날짜·장소·주최는 필수입니다." };
  }

  // slug 자동 생성 (영문 + 숫자만, 한글/특수문자는 처리 안 함)
  const slugBase =
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || `battle-${Date.now()}`;
  const slug = `${slugBase}-${date.replace(/-/g, "").slice(0, 8)}`;

  const payload = {
    slug,
    title,
    date,
    description: description || undefined,
    genres: ["allstyle"],
    formats: ["1v1"],
    status: "upcoming",
    venue: { name: venue, address: venue, region },
    organizer,
    links: link ? [{ label: "공식 링크", url: link, type: "official" }] : [],
  };

  const db = getDb();

  // source_record 생성 — 추후 admin queue에서 같은 액션으로 처리 가능
  const [record] = await db
    .insert(schema.sourceRecords)
    .values({
      sourceType: "community_submission",
      sourceUrl: link || `submission://${slug}`,
      sourceId: `user-${authUser.id}-${slug}`,
      rawContent: JSON.stringify({ submitter: authUser.id, ...payload }),
      status: instant ? "published" : "parsed",
      parsedPayload: payload,
      parseConfidence: 1.0,
      parseModel: "user-submission",
      parseWarnings: [],
    })
    .onConflictDoUpdate({
      target: [schema.sourceRecords.sourceType, schema.sourceRecords.sourceId],
      set: {
        rawContent: JSON.stringify({ submitter: authUser.id, ...payload }),
        parsedPayload: payload,
      },
    })
    .returning({ id: schema.sourceRecords.id });

  if (instant) {
    // 즉시 published — battles 테이블에 직접 insert + organizer_claim 부여
    const [battle] = await db
      .insert(schema.battles)
      .values({
        ...payload,
        genres: payload.genres as never,
        formats: payload.formats as never,
        status: payload.status as never,
        venue: payload.venue as never,
        links: payload.links as never,
        isPublished: true,
        sourceRecordId: record.id,
      })
      .onConflictDoUpdate({
        target: schema.battles.slug,
        set: {
          title,
          date,
          description,
          venue: payload.venue as never,
          organizer,
          links: payload.links as never,
        },
      })
      .returning({ id: schema.battles.id });

    await db
      .insert(schema.organizerClaims)
      .values({
        userId: authUser.id,
        battleId: battle.id,
        verifiedAt: new Date(),
        verifiedBy: ctx.role === "admin" ? "admin" : "auto-whitelist",
      })
      .onConflictDoNothing();

    revalidatePath("/");
    revalidatePath(`/battles/${slug}`);
    return { ok: true, status: "published" };
  }

  // 일반 큐 — admin/queue에서 검토
  revalidatePath("/admin/queue");
  return { ok: true, status: "queued" };
}
