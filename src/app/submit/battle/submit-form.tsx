"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { regionLabel } from "@/lib/labels";
import type { Region } from "@/schema";
import { submitBattle } from "./actions";

const REGIONS: Region[] = [
  "seoul",
  "gyeonggi",
  "incheon",
  "busan",
  "daegu",
  "daejeon",
  "gwangju",
  "ulsan",
  "gangwon",
  "jeonbuk",
  "jeonnam",
  "jeju",
  "online",
];

export function SubmitBattleForm({ instant }: { instant: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await submitBattle(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.status === "published") {
        router.push("/?submitted=1");
      } else {
        router.push("/profile?queued=1");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <Field label="제목" required>
        <input
          type="text"
          name="title"
          required
          minLength={2}
          maxLength={120}
          placeholder="예: R16 KOREA 2026"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="날짜" required>
        <input
          type="date"
          name="date"
          required
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="장소" required>
        <input
          type="text"
          name="venue"
          required
          minLength={2}
          maxLength={200}
          placeholder="예: 올림픽공원 SK핸드볼경기장"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="지역" required>
        <select
          name="region"
          defaultValue="seoul"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {regionLabel[r]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="주최자" required>
        <input
          type="text"
          name="organizer"
          required
          minLength={2}
          maxLength={120}
          placeholder="예: R16 KOREA"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="공식 링크" hint="인스타그램 포스트, 공식 사이트, 신청 링크 등">
        <input
          type="url"
          name="link"
          maxLength={500}
          placeholder="https://"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="소개" hint="장르·포맷·심사위원·상금은 운영자가 보완해줍니다">
        <textarea
          name="description"
          rows={4}
          maxLength={2000}
          placeholder="배틀에 대한 소개를 입력하세요..."
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

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
        {pending ? "등록 중..." : instant ? "즉시 등록" : "검토 큐에 제출"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </p>
      {hint && <p className="mb-1.5 text-[10px] text-muted-foreground/70">{hint}</p>}
      {children}
    </div>
  );
}
