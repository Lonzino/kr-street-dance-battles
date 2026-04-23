"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { statusLabel } from "@/lib/labels";
import type { Battle, BattleStatus } from "@/schema";
import { updateBattle } from "./actions";

const STATUSES: BattleStatus[] = ["registration", "upcoming", "ongoing", "finished", "cancelled"];

export function EditBattleForm({
  battleSlug,
  battleId,
  initial,
}: {
  battleSlug: string;
  battleId: string;
  initial: Battle;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [posterUrl, setPosterUrl] = useState(initial.posterUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("battleSlug", battleSlug);
      fd.append("battleId", battleId);

      const res = await fetch("/api/upload/poster", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `업로드 실패 ${res.status}`);
      }
      const data = await res.json();
      setPosterUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    start(async () => {
      const patch = {
        title: String(formData.get("title") ?? "").trim() || initial.title,
        subtitle: String(formData.get("subtitle") ?? "").trim() || undefined,
        description: String(formData.get("description") ?? "").trim() || undefined,
        date: String(formData.get("date") ?? "").trim() || initial.date,
        endDate: String(formData.get("endDate") ?? "").trim() || undefined,
        status: String(formData.get("status") ?? initial.status) as BattleStatus,
        posterUrl: posterUrl || undefined,
      };
      const res = await updateBattle(battleId, battleSlug, patch);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <Field label="제목">
        <input
          type="text"
          name="title"
          defaultValue={initial.title}
          required
          minLength={2}
          maxLength={120}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="부제">
        <input
          type="text"
          name="subtitle"
          defaultValue={initial.subtitle ?? ""}
          maxLength={120}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="시작일">
        <input
          type="date"
          name="date"
          defaultValue={initial.date}
          required
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="종료일 (선택)">
        <input
          type="date"
          name="endDate"
          defaultValue={initial.endDate ?? ""}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="상태">
        <select
          name="status"
          defaultValue={initial.status}
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="포스터 (5MB 이하 jpeg/png/webp/gif)">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-xs file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:font-bold file:text-black"
        />
        {uploading && <p className="mt-2 text-xs text-muted-foreground">업로드 중...</p>}
        {posterUrl && (
          // biome-ignore lint/performance/noImgElement: 동적 미리보기 — Next/Image 도메인 화이트리스트와 별개
          <img
            src={posterUrl}
            alt="포스터 미리보기"
            className="mt-3 max-h-60 rounded border border-border"
          />
        )}
      </Field>

      <Field label="소개">
        <textarea
          name="description"
          defaultValue={initial.description ?? ""}
          rows={5}
          maxLength={2000}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
