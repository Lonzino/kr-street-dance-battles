import { createClient } from "@supabase/supabase-js";

/**
 * Service role 클라이언트 — auth.users 삭제 등 admin 권한 필요 작업용.
 *
 * 환경변수: SUPABASE_SERVICE_ROLE_KEY (절대 클라이언트 노출 금지)
 *
 * 미설정 시 throw — 호출부에서 catch 하고 graceful fallback (수동 삭제 안내).
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 미설정 — auth.users 자동 삭제 불가. Supabase Dashboard에서 수동 삭제 필요.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
