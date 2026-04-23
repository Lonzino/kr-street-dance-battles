"use client";

import { useState, useTransition } from "react";
import { genreLabel, regionLabel } from "@/lib/labels";
import type { NotificationPrefs } from "@/lib/notification-prefs";
import type { DanceGenre, Region } from "@/schema";
import { savePrefs } from "./actions";

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
  "gangwon",
  "jeonbuk",
  "jeonnam",
  "jeju",
  "online",
];

export function NotificationsForm({ initial }: { initial: NotificationPrefs }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await savePrefs(formData);
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <form action={onSubmit} className="space-y-8">
      <Section title="채널">
        <p className="mb-2 text-xs text-muted-foreground">
          현재 이메일만 지원. 웹푸시·디스코드는 추후.
        </p>
        <div className="flex gap-2">
          <Toggle name="channels" value="email" defaultChecked={initial.channels.includes("email")}>
            이메일
          </Toggle>
        </div>
      </Section>

      <Section title="관심 지역">
        <p className="mb-2 text-xs text-muted-foreground">선택 안 하면 모든 지역.</p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <Toggle
              key={r}
              name="regions"
              value={r}
              defaultChecked={initial.regions?.includes(r) ?? false}
            >
              {regionLabel[r]}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section title="관심 장르">
        <p className="mb-2 text-xs text-muted-foreground">선택 안 하면 모든 장르.</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Toggle
              key={g}
              name="genres"
              value={g}
              defaultChecked={initial.genres?.includes(g) ?? false}
            >
              {genreLabel[g]}
            </Toggle>
          ))}
        </div>
      </Section>

      <Section title="사전 알림 시점">
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="leadDays"
            defaultValue={initial.leadDays}
            min={0}
            max={30}
            className="w-20 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
          />
          <span className="text-sm text-muted-foreground">일 전 알림</span>
        </div>
      </Section>

      <Section title="추가 옵션">
        <div className="space-y-2">
          <Check name="weeklyDigest" defaultChecked={initial.weeklyDigest}>
            주간 다이제스트 (월요일 아침)
          </Check>
          <Check name="bookmarkAlerts" defaultChecked={initial.bookmarkAlerts}>
            북마크한 배틀 변경 알림
          </Check>
        </div>
      </Section>

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

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Toggle({
  name,
  value,
  defaultChecked,
  children,
}: {
  name: string;
  value: string;
  defaultChecked: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="cursor-pointer rounded-full border border-border bg-muted/30 px-3 py-1 text-xs has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-black">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      {children}
    </label>
  );
}

function Check({
  name,
  defaultChecked,
  children,
}: {
  name: string;
  defaultChecked: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border bg-muted accent-accent"
      />
      {children}
    </label>
  );
}
