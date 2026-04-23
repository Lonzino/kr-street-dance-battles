"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleBookmark } from "@/lib/bookmarks";

/**
 * 북마크 토글 버튼.
 * - 미로그인 클릭 → /login 으로 redirect (next 파라미터 보존)
 * - 로그인 → 토글 + optimistic UI
 */
export function BookmarkButton({
  battleSlug,
  initialBookmarked,
  variant = "icon",
}: {
  battleSlug: string;
  initialBookmarked: boolean;
  variant?: "icon" | "full";
}) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    const previous = bookmarked;
    setBookmarked(!previous);
    start(async () => {
      try {
        const result = await toggleBookmark(battleSlug);
        setBookmarked(result.bookmarked);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === "UNAUTHENTICATED") {
          router.push(`/login?next=${encodeURIComponent(`/battles/${battleSlug}`)}`);
          return;
        }
        setBookmarked(previous);
        setError(msg);
      }
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={bookmarked ? "북마크 해제" : "북마크"}
        title={error ?? (bookmarked ? "북마크 해제" : "북마크")}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
          bookmarked
            ? "border-accent bg-accent/20 text-accent"
            : "border-border bg-background/60 text-muted-foreground hover:border-accent/50 hover:text-accent"
        } disabled:opacity-50`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <title>북마크</title>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
        bookmarked
          ? "border-accent bg-accent/20 text-accent"
          : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
      } disabled:opacity-50`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <title>북마크</title>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {bookmarked ? "북마크됨" : "북마크"}
    </button>
  );
}
