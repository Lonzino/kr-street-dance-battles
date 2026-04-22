import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (PUBLIC_ADMIN_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return redirectToLogin(req);

  const ok = await verifySessionToken(token);
  if (!ok) return redirectToLogin(req);

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
