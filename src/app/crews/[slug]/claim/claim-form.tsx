"use client";

import { useState, useTransition } from "react";
import { submitCrewClaim } from "./actions";

export function ClaimCrewForm({ crewSlug, crewName }: { crewSlug: string; crewName: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await submitCrewClaim(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-sm">
        <p className="font-bold text-emerald-300">✓ 클레임 신청 완료</p>
        <p className="mt-2 text-emerald-200/90">
          운영자가 1~3일 내 검토 후 알림드립니다. 추가 증빙이 필요하면 이메일로 연락드릴게요.
        </p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <input type="hidden" name="crewSlug" value={crewSlug} />
      <input type="hidden" name="crewName" value={crewName} />

      <div>
        <p className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          증빙 링크 <span className="text-accent">*</span>
        </p>
        <p className="mb-1.5 text-[10px] text-muted-foreground/70">
          본인이 크루 멤버임을 보여주는 인스타 게시물 / 영상 / 사진 URL
        </p>
        <input
          type="url"
          name="evidence"
          required
          maxLength={500}
          placeholder="https://www.instagram.com/p/..."
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          추가 설명 (선택)
        </p>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="역할, 활동 기간, 멤버명 등"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "제출 중..." : "클레임 신청"}
      </button>
    </form>
  );
}
