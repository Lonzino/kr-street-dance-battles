import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * 사용자 로그아웃 — Supabase 세션 종료 후 홈으로.
 * (운영자 admin JWT 로그아웃은 /api/admin/logout으로 별도)
 */
export async function POST(req: NextRequest) {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", req.nextUrl.origin), { status: 303 });
}
