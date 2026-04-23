import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ingest } from "@/ingestion/pipeline";
import { getClientIp, rateLimitWithCleanup } from "@/lib/rate-limit";

/**
 * 외부 클라이언트(Discord 봇 등)에서 호출하는 ingest 엔드포인트.
 *
 * 인증: 헤더 X-Ingest-Token (서버 측 INGEST_TOKEN과 일치 필요).
 * Rate limit: IP당 분당 30회 (defense in depth — 토큰 노출 시 LLM 비용 폭주 방지).
 */

export const runtime = "nodejs";

const Body = z.object({
  input: z.string().min(1).max(50_000),
});

export async function POST(req: NextRequest) {
  const expected = process.env.INGEST_TOKEN;
  const provided = req.headers.get("x-ingest-token");
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Rate limit — 토큰이 새도 IP당 분당 30회로 제한.
  const ip = getClientIp(req);
  const rl = rateLimitWithCleanup(`ingest:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryInMs: rl.resetInMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetInMs / 1000)) } },
    );
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "invalid_body", detail: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }

  try {
    const result = await ingest(body.input);
    return NextResponse.json({
      ok: true,
      recordId: result.recordId,
      confidence: result.confidence,
      reviewUrl: `/admin/queue`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "ingest_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
