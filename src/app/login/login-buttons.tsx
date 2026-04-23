"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Kakao + Google OAuth 시작 버튼.
 * Supabase signInWithOAuth → provider 페이지로 redirect → /auth/callback 으로 돌아옴.
 */
export function LoginButtons({ next }: { next?: string }) {
  const [pending, setPending] = useState<"kakao" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: "kakao" | "google") {
    setError(null);
    setPending(provider);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = new URL(
        `/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
        window.location.origin,
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo.toString() },
      });
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPending(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => signIn("kakao")}
        disabled={pending !== null}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 text-sm font-bold text-[#191919] hover:opacity-90 disabled:opacity-50"
      >
        {pending === "kakao" ? "이동 중..." : "카카오로 시작"}
      </button>
      <button
        type="button"
        onClick={() => signIn("google")}
        disabled={pending !== null}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
      >
        {pending === "google" ? "이동 중..." : "Google로 시작"}
      </button>

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </>
  );
}
