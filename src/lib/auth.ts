import { jwtVerify, SignJWT } from "jose";

/**
 * 운영자 인증.
 *
 * 단일 운영자 가정. ADMIN_PASSWORD를 비교하고, 통과 시 JWT 발급.
 * JWT는 HMAC SHA-256으로 서명되며 HttpOnly·Secure·SameSite=Lax 쿠키에 저장.
 */

export const COOKIE_NAME = "krsdb_admin";
export const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 7; // 7일

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET이 32자 이상이어야 합니다.");
  }
  return new TextEncoder().encode(secret);
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  // 타이밍 공격 방어: 길이 차이도 일정 시간 안에 흡수.
  // 길이 미스매치 시 즉시 return하지 않고 항상 max 길이만큼 XOR.
  const a = new TextEncoder().encode(input);
  const b = new TextEncoder().encode(expected);
  const len = Math.max(a.length, b.length, 1);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return expected.length > 0 && diff === 0;
}

export async function createSessionToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_S}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
