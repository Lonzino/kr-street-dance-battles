"use client";

import { useState, useTransition } from "react";
import { genreLabel, regionLabel } from "@/lib/labels";
import type { DanceGenre, Region, User } from "@/schema";
import { saveProfile } from "./actions";

const GENRES: DanceGenre[] = [
  "bboying",
  "popping",
  "locking",
  "hiphop",
  "house",
  "krump",
  "waacking",
  "voguing",
  "allstyle",
  "mixed",
];

const REGIONS: Region[] = [
  "seoul",
  "gyeonggi",
  "incheon",
  "busan",
  "daegu",
  "daejeon",
  "gwangju",
  "ulsan",
  "sejong",
  "gangwon",
  "chungbuk",
  "chungnam",
  "jeonbuk",
  "jeonnam",
  "gyeongbuk",
  "gyeongnam",
  "jeju",
  "online",
];

export function ProfileForm({ initial }: { initial: User | null }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await saveProfile(formData);
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <Field label="닉네임" hint="2~24자, 영숫자·언더스코어·한글">
        <input
          type="text"
          name="nickname"
          defaultValue={initial?.nickname ?? ""}
          minLength={2}
          maxLength={24}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="소개" hint="500자 이내">
        <textarea
          name="bio"
          defaultValue={initial?.bio ?? ""}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="활동 지역">
        <select
          name="region"
          defaultValue={initial?.region ?? ""}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          <option value="">선택 안 함</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {regionLabel[r]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="주 장르 (최대 5개)">
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const checked = initial?.primaryGenres?.includes(g) ?? false;
            return (
              <label
                key={g}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-black"
              >
                <input
                  type="checkbox"
                  name="primaryGenres"
                  value={g}
                  defaultChecked={checked}
                  className="sr-only"
                />
                {genreLabel[g]}
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="인스타그램 핸들" hint="@ 없이 입력">
        <input
          type="text"
          name="instagramHandle"
          defaultValue={initial?.instagramHandle ?? ""}
          maxLength={40}
          placeholder="dancer_kr"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          ✓ 저장됨
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "저장 중..." : "저장"}
        </button>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground hover:border-red-500/50 hover:text-red-300"
          >
            로그아웃
          </button>
        </form>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  // Field는 label을 시각적으로만 표시. 실제 input의 접근성은 placeholder + name으로.
  return (
    <div>
      <p className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {hint && <p className="mb-1.5 text-[10px] text-muted-foreground/70">{hint}</p>}
      {children}
    </div>
  );
}
