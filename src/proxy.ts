import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

/**
 * Proxy 두 가지 역할:
 * 1. 모든 요청에서 Supabase 세션 토큰 갱신 (cookie refresh)
 * 2. /admin/* 경로는 운영자 JWT 검증 (Supabase Auth와 별도)
 *
 * 운영자 JWT는 단일 비밀번호 기반 — Supabase Auth가 활성화돼도 admin 흐름은 그대로 유지.
 */
export const config = {
  // matcher 미지정 시 모든 라우트에서 실행. _next, 정적 자산은 제외.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function proxy(req: NextRequest) {
  // 1. Supabase 세션 갱신 (모든 요청)
  const { response } = await updateSupabaseSession(req);

  // 2. /admin/*는 운영자 JWT 추가 검증
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (!PUBLIC_ADMIN_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (!token) return redirectToAdminLogin(req);
      const ok = await verifySessionToken(token);
      if (!ok) return redirectToAdminLogin(req);
    }
  }

  return response;
}

function redirectToAdminLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
