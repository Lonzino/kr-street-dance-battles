import { and, eq, gte, isNotNull, lte, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getDb, isDbConfigured, schema } from "@/db/client";
import { sendEmail } from "@/lib/email/client";
import { buildDailyAlertEmail } from "@/lib/email/templates";
import type { Battle } from "@/schema";

/**
 * Vercel Cron — 매일 한 번 실행. 사용자별 관심사 매칭 배틀이 있으면 메일 발송.
 *
 * 매칭 로직:
 * - notification_prefs.weeklyDigest=true OR (lead_days 안의 새 배틀 존재)
 * - regions/genres가 null이면 전체 매칭
 * - 마지막 발송 후 12시간 이상 지났을 때만 (중복 방지)
 *
 * 인증: Authorization: Bearer <CRON_SECRET>
 */

export const runtime = "nodejs";
export const maxDuration = 60;

interface UserBundle {
  authId: string;
  email: string;
  nickname: string | null;
  prefs: typeof schema.notificationPrefs.$inferSelect;
}

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
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  // 1. 알림 받을 사용자 + prefs + email 조회
  const recipients = (await db
    .select({
      authId: schema.users.id,
      email: schema.users.email,
      nickname: schema.users.nickname,
      prefs: schema.notificationPrefs,
    })
    .from(schema.notificationPrefs)
    .innerJoin(schema.users, eq(schema.users.id, schema.notificationPrefs.userId))
    .where(
      and(
        isNotNull(schema.users.email),
        or(
          eq(schema.notificationPrefs.lastDailySentAt, new Date(0)),
          lte(schema.notificationPrefs.lastDailySentAt, twelveHoursAgo),
        ),
      ),
    )) as UserBundle[];

  // 2. 발송 대상 배틀 — 오늘부터 leadDays 이내 시작
  const allUpcoming = await db
    .select()
    .from(schema.battles)
    .where(and(eq(schema.battles.isPublished, true), gte(schema.battles.date, todayStr(now))))
    .orderBy(schema.battles.date);

  const sent: { authId: string; count: number; ok: boolean }[] = [];

  // 3. 사용자별 매칭 + 발송
  for (const r of recipients) {
    const matched = filterForUser(
      allUpcoming as (typeof schema.battles.$inferSelect)[],
      r.prefs,
      now,
    );
    if (matched.length === 0) continue;

    const { subject, html, text } = buildDailyAlertEmail({
      nickname: r.nickname,
      battles: matched.map(rowToBattle),
    });

    const result = await sendEmail({ to: r.email, subject, html, text });

    if (result.ok) {
      await db
        .update(schema.notificationPrefs)
        .set({ lastDailySentAt: now })
        .where(eq(schema.notificationPrefs.userId, r.authId));
    }

    sent.push({ authId: r.authId, count: matched.length, ok: result.ok });
  }

  return NextResponse.json({ ok: true, recipients: recipients.length, sent });
}

function filterForUser(
  battles: (typeof schema.battles.$inferSelect)[],
  prefs: typeof schema.notificationPrefs.$inferSelect,
  now: Date,
): (typeof schema.battles.$inferSelect)[] {
  const cutoff = new Date(now.getTime() + prefs.leadDays * 24 * 60 * 60 * 1000);
  return battles.filter((b) => {
    const battleDate = new Date(b.date);
    if (battleDate > cutoff) return false;
    if (prefs.regions && prefs.regions.length > 0) {
      const region = (b.venue as { region: string }).region;
      if (!prefs.regions.includes(region as never)) return false;
    }
    if (prefs.genres && prefs.genres.length > 0) {
      const overlap = b.genres.some((g) => prefs.genres?.includes(g as never));
      if (!overlap) return false;
    }
    return true;
  });
}

function todayStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function rowToBattle(r: typeof schema.battles.$inferSelect): Battle {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    description: r.description ?? undefined,
    date: r.date,
    endDate: r.endDate ?? undefined,
    registrationDeadline: r.registrationDeadline ?? undefined,
    genres: r.genres as Battle["genres"],
    formats: r.formats as Battle["formats"],
    status: r.status as Battle["status"],
    venue: r.venue,
    organizer: r.organizer,
    judges: r.judges ?? undefined,
    prize: r.prize ?? undefined,
    entryFee: r.entryFee ?? undefined,
    posterUrl: r.posterUrl ?? undefined,
    links: r.links ?? [],
    results: r.results ?? undefined,
    tags: r.tags ?? undefined,
  };
}
