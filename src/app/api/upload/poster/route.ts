import { type NextRequest, NextResponse } from "next/server";
import { canEditBattle, loadAuthzContext } from "@/lib/authz";
import { rateLimitWithCleanup } from "@/lib/rate-limit";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import { uploadPoster } from "@/lib/supabase/storage";

/**
 * 배틀 포스터 업로드 — multipart/form-data, fields: file, battleSlug, battleId.
 *
 * 권한: canEditBattle 통과 필요 (admin 또는 verified organizer_claim).
 * Rate limit: 사용자당 분당 5회.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rl = rateLimitWithCleanup(`upload:${authUser.id}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const ctx = await loadAuthzContext(authUser.id);
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const battleSlug = String(formData.get("battleSlug") ?? "");
  const battleId = String(formData.get("battleId") ?? "");

  if (!file || !battleSlug || !battleId) {
    return NextResponse.json({ error: "file, battleSlug, battleId 필수" }, { status: 400 });
  }

  const allowed = await canEditBattle(ctx, battleId);
  if (!allowed) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const result = await uploadPoster(file, battleSlug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url });
}
