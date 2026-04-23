import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  // 303 See Other: POST → GET 으로 메서드 전환되어 브라우저가 /admin/login에 POST 재시도하지 않음
  // origin은 현재 요청에서 가져와 NEXT_PUBLIC_SITE_URL 누락에도 안전.
  return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin), {
    status: 303,
  });
}
