import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ingest } from "@/ingestion/pipeline";

/**
 * 외부 클라이언트(Discord 봇 등)에서 호출하는 ingest 엔드포인트.
 *
 * 인증: 헤더 X-Ingest-Token (서버 측 INGEST_TOKEN과 일치 필요).
 *       /admin은 proxy로 보호되지만 이 엔드포인트는 봇용이므로 토큰 기반.
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
