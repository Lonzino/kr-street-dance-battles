import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserRow } from "@/lib/users";

/**
 * OAuth 콜백 핸들러.
 *
 * Kakao/Google에서 redirect_uri로 돌아올 때 ?code=... 가 옴.
 * code → 세션 교환 → users 테이블에 row 보장 → /profile 또는 ?next= 로 리다이렉트.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await getSupabaseServerClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await ensureUserRow(data.user.id, data.user.email, data.user.user_metadata?.avatar_url ?? null);
  }

  return NextResponse.redirect(`${origin}${next}`, { status: 303 });
}
