/**
 * 인메모리 rate limiter — best effort.
 *
 * 한계:
 * - Vercel 같은 서버리스에서는 인스턴스마다 메모리가 분리됨 → 인스턴스 N개면 실효 한도 N*limit
 * - 단일 인스턴스에서는 정확히 동작 (개발·소규모 트래픽)
 *
 * 프로덕션 강화: Upstash Redis 또는 @vercel/kv로 교체.
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *
 * 현재로선 brute-force를 1대 안에서만이라도 늦추는 게 목적.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInMs: number;
}

export function rateLimit(key: string, opts: { limit: number; windowMs: number }): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + opts.windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: opts.limit - 1, resetInMs: opts.windowMs };
  }

  existing.count += 1;
  const remaining = Math.max(0, opts.limit - existing.count);
  return {
    ok: existing.count <= opts.limit,
    remaining,
    resetInMs: existing.resetAt - now,
  };
}

/**
 * 주기적으로 만료된 버킷 정리 (메모리 누수 방지).
 * 1000번에 1번만 실행 (오버헤드 최소화).
 */
let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter += 1;
  if (cleanupCounter % 1000 !== 0) return;
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}

export function rateLimitWithCleanup(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  maybeCleanup();
  return rateLimit(key, opts);
}

/**
 * 요청에서 클라이언트 IP 추출 (Vercel/일반 프록시 환경).
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
