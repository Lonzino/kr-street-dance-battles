import { type NextRequest, NextResponse } from "next/server";
import { getBookmarkedBattles } from "@/lib/bookmarks";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCurrentAuthUser } from "@/lib/supabase/server";
import type { Battle } from "@/schema";

/**
 * 사용자의 북마크 배틀을 iCalendar (RFC 5545) 형식으로 반환.
 *
 * 사용법: 캘린더 앱(구글/애플)에서 "URL로 구독" → /calendar.ics URL 입력.
 * 미로그인 시 빈 캘린더 반환 (에러 대신).
 *
 * 주의: 이 라우트는 사용자 쿠키 기반이라 캘린더 앱이 인증 안 됨.
 *       추후 user-specific token URL 또는 .ics 파일 다운로드로 전환 권장.
 */
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const authUser = await getCurrentAuthUser();
  const battles = authUser ? await getBookmarkedBattles(authUser.id) : [];

  const ics = buildIcs(battles);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kr-street-dance-battles.ics"',
      "Cache-Control": "private, max-age=300",
    },
  });
}

function buildIcs(battles: Battle[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KR Street Dance Battles//KR//KO",
    `X-WR-CALNAME:${SITE_NAME} 북마크`,
    "X-WR-TIMEZONE:Asia/Seoul",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const b of battles) {
    const start = b.date.replace(/-/g, "");
    const end = (b.endDate ?? b.date).replace(/-/g, "");
    // 종료 다음날 (DTEND는 exclusive)
    const endNext = addOneDay(end);

    lines.push(
      "BEGIN:VEVENT",
      `UID:battle-${b.slug}@kr-street-dance-battles`,
      `DTSTAMP:${formatNowUtc()}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${endNext}`,
      `SUMMARY:${escapeIcs(b.title)}`,
      `LOCATION:${escapeIcs(b.venue.name)}, ${escapeIcs(b.venue.address)}`,
      `URL:${SITE_URL}/battles/${b.slug}`,
      `DESCRIPTION:${escapeIcs(buildDescription(b))}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

function buildDescription(b: Battle): string {
  const parts = [
    b.subtitle,
    b.organizer && `주최: ${b.organizer}`,
    b.judges && b.judges.length > 0 && `심사: ${b.judges.join(", ")}`,
    b.description,
    `\n${SITE_URL}/battles/${b.slug}`,
  ].filter(Boolean);
  return parts.join("\n");
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function addOneDay(yyyymmdd: string): string {
  const y = Number(yyyymmdd.slice(0, 4));
  const m = Number(yyyymmdd.slice(4, 6)) - 1;
  const d = Number(yyyymmdd.slice(6, 8));
  const next = new Date(Date.UTC(y, m, d + 1));
  return `${next.getUTCFullYear()}${String(next.getUTCMonth() + 1).padStart(2, "0")}${String(next.getUTCDate()).padStart(2, "0")}`;
}

function formatNowUtc(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}T${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}${String(now.getUTCSeconds()).padStart(2, "0")}Z`;
}
