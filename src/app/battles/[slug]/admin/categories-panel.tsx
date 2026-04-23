"use client";

import { useState, useTransition } from "react";
import { formatLabel, genreLabel } from "@/lib/labels";
import type { BattleCategory, BattleFormat, DanceGenre } from "@/schema";
import { addCategory, removeCategory } from "./actions";

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

const FORMATS: BattleFormat[] = [
  "1v1",
  "2v2",
  "3v3",
  "4v4",
  "5v5",
  "7toSmoke",
  "crewBattle",
  "showcase",
  "cypher",
];

export function CategoriesPanel({
  battleId,
  battleSlug,
  categories,
}: {
  battleId: string;
  battleSlug: string;
  categories: BattleCategory[];
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function onAdd(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await addCategory(battleId, battleSlug, formData);
      if (!res.ok) setError(res.error);
      else setShowForm(false);
    });
  }

  function onRemove(categoryId: string) {
    if (!confirm("이 부문을 삭제하면 신청자도 같이 삭제됩니다. 진행할까요?")) return;
    setError(null);
    start(async () => {
      const res = await removeCategory(categoryId, battleSlug);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-3">
      {categories.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4"
        >
          <div className="flex-1">
            <p className="font-medium">{c.name}</p>
            <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
              {c.genres.map((g) => (
                <span key={g} className="rounded bg-foreground/10 px-1.5 py-0.5">
                  {genreLabel[g]}
                </span>
              ))}
              <span className="rounded border border-border px-1.5 py-0.5">
                {formatLabel[c.format]}
              </span>
              {c.maxParticipants !== null && <span>· 정원 {c.maxParticipants}명</span>}
              {c.registrationFee !== null && c.registrationFee > 0 && (
                <span>· {c.registrationFee.toLocaleString()}원</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(c.id)}
            disabled={pending}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-500/40 hover:text-red-300"
          >
            삭제
          </button>
        </div>
      ))}

      {showForm ? (
        <form
          action={onAdd}
          className="space-y-3 rounded-lg border border-accent/40 bg-accent/5 p-4"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="부문명 (예: 1on1 비보잉)"
            className="w-full rounded border border-border bg-background/60 px-3 py-2 text-sm"
          />

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
              장르 (복수 선택)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => (
                <label
                  key={g}
                  className="cursor-pointer rounded-full border border-border bg-muted/30 px-2 py-0.5 text-xs has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-black"
                >
                  <input type="checkbox" name="genres" value={g} className="sr-only" />
                  {genreLabel[g]}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              name="format"
              defaultValue="1v1"
              className="rounded border border-border bg-background/60 px-3 py-2 text-sm"
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {formatLabel[f]}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="maxParticipants"
              placeholder="정원 (비우면 무제한)"
              min={1}
              className="rounded border border-border bg-background/60 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="registrationFee"
              placeholder="참가비 (원)"
              min={0}
              step={1000}
              className="rounded border border-border bg-background/60 px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              name="closesAt"
              className="rounded border border-border bg-background/60 px-3 py-2 text-sm"
            />
          </div>

          <textarea
            name="paymentInstruction"
            rows={3}
            placeholder="결제 안내 (계좌번호, 토스 링크 등) — 신청자에게 노출됨"
            className="w-full rounded border border-border bg-background/60 px-3 py-2 text-xs"
          />

          {error && <p className="rounded bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-accent px-4 py-1.5 text-xs font-bold text-black"
            >
              {pending ? "추가 중..." : "추가"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded border border-border px-4 py-1.5 text-xs"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-accent hover:text-accent"
        >
          + 부문 추가
        </button>
      )}
    </div>
  );
}
