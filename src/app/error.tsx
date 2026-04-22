"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-7xl text-red-400">!</div>
      <h1 className="mt-4 text-2xl font-bold">오류가 발생했습니다</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        잠시 후 다시 시도하거나 홈으로 돌아가주세요.
      </p>
      {error.digest && <p className="mt-2 text-xs text-muted-foreground/60">ref: {error.digest}</p>}
      <div className="mt-8 flex gap-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-4 py-2 font-bold text-black hover:opacity-90"
        >
          다시 시도
        </button>
        <a href="/" className="rounded-md border border-border px-4 py-2 hover:border-accent">
          홈으로
        </a>
      </div>
    </div>
  );
}
