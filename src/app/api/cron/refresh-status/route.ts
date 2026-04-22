import { and, eq, lt } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/db/client";

/**
 * Vercel Cron으로 매일 호출되는 엔드포인트.
 *
 * 동작:
 * - registration 상태 + 등록 마감 지난 배틀 → upcoming
 * - upcoming 상태 + 시작일 지난 배틀 → ongoing
 * - ongoing 상태 + 종료일(없으면 시작일) 지난 배틀 → finished
 *
 * 인증: Vercel Cron이 헤더 Authorization: Bearer <CRON_SECRET> 자동 부여.
 */

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, skipped: "db_not_configured" });
  }

  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const r1 = await db
    .update(schema.battles)
    .set({ status: "upcoming", updatedAt: new Date() })
    .where(
      and(
        eq(schema.battles.status, "registration"),
        lt(schema.battles.registrationDeadline, today),
      ),
    )
    .returning({ slug: schema.battles.slug });

  const r2 = await db
    .update(schema.battles)
    .set({ status: "ongoing", updatedAt: new Date() })
    .where(and(eq(schema.battles.status, "upcoming"), lt(schema.battles.date, today)))
    .returning({ slug: schema.battles.slug });

  // ongoing → finished: endDate가 있으면 endDate, 없으면 date 기준
  // SQL CASE 표현식이 필요. 단순화: 별도 두 쿼리.
  const r3a = await db
    .update(schema.battles)
    .set({ status: "finished", updatedAt: new Date() })
    .where(and(eq(schema.battles.status, "ongoing"), lt(schema.battles.endDate, today)))
    .returning({ slug: schema.battles.slug });

  const r3b = await db
    .update(schema.battles)
    .set({ status: "finished", updatedAt: new Date() })
    .where(
      and(
        eq(schema.battles.status, "ongoing"),
        eq(schema.battles.endDate, ""),
        lt(schema.battles.date, today),
      ),
    )
    .returning({ slug: schema.battles.slug });

  return NextResponse.json({
    ok: true,
    transitions: {
      "registration → upcoming": r1.map((x) => x.slug),
      "upcoming → ongoing": r2.map((x) => x.slug),
      "ongoing → finished": [...r3a, ...r3b].map((x) => x.slug),
    },
  });
}
