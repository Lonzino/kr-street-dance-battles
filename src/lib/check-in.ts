import { createHmac, randomBytes } from "node:crypto";

/**
 * 체크인 토큰 — registrations.checkInToken 컬럼에 저장.
 * QR 코드로 인코딩되어 주최자가 스캔.
 *
 * 형식: <16-byte random hex>.<HMAC-SHA256(random, JWT_SECRET) 12자>
 * 위·변조 방지용 — 토큰만 알면 인증 없이도 체크인 가능 (현장에서는 OK).
 */

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET 미설정 또는 32자 미만");
  }
  return s;
}

export function generateCheckInToken(): string {
  const random = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", getSecret()).update(random).digest("hex").slice(0, 12);
  return `${random}.${sig}`;
}

export function verifyCheckInToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [random, sig] = parts;
  const expected = createHmac("sha256", getSecret()).update(random).digest("hex").slice(0, 12);
  // timing-safe compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

/**
 * QR 코드로 인코딩될 URL.
 * 주최자가 스마트폰 카메라로 스캔하면 자동으로 /admin/check-in/<token>으로 이동.
 */
export function buildCheckInUrl(siteUrl: string, token: string): string {
  return `${siteUrl}/admin/check-in/${token}`;
}
