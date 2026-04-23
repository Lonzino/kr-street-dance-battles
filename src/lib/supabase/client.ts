"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저 사이드 Supabase 클라이언트.
 * 'use client' 컴포넌트에서만 사용.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 미설정");
  }
  return createBrowserClient(url, anonKey);
}
