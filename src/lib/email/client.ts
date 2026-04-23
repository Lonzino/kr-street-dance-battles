import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";

/**
 * Resend 메일 클라이언트.
 *
 * 환경변수 미설정 시 dry-run (콘솔 로그만) — 개발/CI에서 안전.
 *
 * RESEND_FROM 형식: "이름 <email@domain.com>"
 *   도메인은 Resend Dashboard에서 verified 필요. 미인증 시 onboarding@resend.dev 사용 가능 (테스트만).
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  dryRun?: boolean;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.log(`[email DRY-RUN] to=${msg.to} subject="${msg.subject}"`);
    return { ok: true, dryRun: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
