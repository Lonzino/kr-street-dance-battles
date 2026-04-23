import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatDateKR, formatLabel, genreLabel, regionLabel } from "@/lib/labels";
import type { Battle } from "@/schema";

/**
 * 사용자 관심사에 매칭된 배틀 일일 알림 메일 템플릿.
 */
export function buildDailyAlertEmail(opts: { nickname: string | null; battles: Battle[] }): {
  subject: string;
  html: string;
  text: string;
} {
  const name = opts.nickname ?? "댄서";
  const count = opts.battles.length;
  const subject =
    count === 1
      ? `[${SITE_NAME}] ${opts.battles[0].title} 알림`
      : `[${SITE_NAME}] 새 배틀 ${count}건`;

  const text = [
    `${name}님,`,
    "",
    `관심사에 매칭된 배틀 ${count}건을 알려드려요.`,
    "",
    ...opts.battles.map(
      (b) =>
        `· ${formatDateKR(b.date)} — ${b.title} (${regionLabel[b.venue.region]})\n  ${SITE_URL}/battles/${b.slug}`,
    ),
    "",
    "관심 없으면 알림 설정에서 끌 수 있어요:",
    `${SITE_URL}/profile/notifications`,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="ko">
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0a0a0b; color:#fafafa; margin:0; padding:24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px; margin:0 auto;">
    <tr><td style="padding-bottom:16px;">
      <div style="font-size:12px; letter-spacing:0.2em; color:#f97316; font-weight:bold;">KR STREET DANCE BATTLES</div>
    </td></tr>
    <tr><td style="padding-bottom:24px;">
      <h1 style="font-size:22px; margin:0;">${escapeHtml(name)}님, 새 배틀이에요</h1>
      <p style="margin:8px 0 0; font-size:13px; color:#8a8a92;">관심사에 매칭된 배틀 ${count}건</p>
    </td></tr>
    ${opts.battles
      .map(
        (b) => `
    <tr><td style="padding:12px 0; border-top:1px solid #27272a;">
      <a href="${SITE_URL}/battles/${b.slug}" style="color:#fafafa; text-decoration:none;">
        <div style="font-size:11px; color:#8a8a92;">${escapeHtml(formatDateKR(b.date, b.endDate))}</div>
        <div style="font-size:16px; font-weight:bold; margin-top:4px;">${escapeHtml(b.title)}</div>
        <div style="font-size:12px; color:#8a8a92; margin-top:6px;">
          ${escapeHtml(regionLabel[b.venue.region])} · ${escapeHtml(b.venue.name)}
          · ${b.genres.map((g) => escapeHtml(genreLabel[g])).join(", ")}
          · ${b.formats.map((f) => escapeHtml(formatLabel[f])).join(", ")}
        </div>
      </a>
    </td></tr>`,
      )
      .join("")}
    <tr><td style="padding-top:32px; font-size:11px; color:#8a8a92; border-top:1px solid #27272a;">
      이 메일은 ${SITE_NAME} 알림 설정에 따라 보내드려요.<br>
      <a href="${SITE_URL}/profile/notifications" style="color:#f97316;">알림 설정 변경</a>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
