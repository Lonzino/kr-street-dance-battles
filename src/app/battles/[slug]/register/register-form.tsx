"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatLabel, genreLabel } from "@/lib/labels";
import type { BattleCategory } from "@/schema";
import { submitRegistration } from "./actions";

export function RegisterForm({
  battleSlug,
  categories,
  registeredCategoryIds,
}: {
  battleSlug: string;
  categories: BattleCategory[];
  registeredCategoryIds: string[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = categories.find((c) => c.id === selectedId);
  const needsPartner = selected?.format && /^[2-5]v[2-5]$/.test(selected.format);
  const needsCrew = selected?.format === "crewBattle";

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await submitRegistration(battleSlug, formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/battles/${battleSlug}?registered=${res.status}`);
    });
  }

  const registeredSet = new Set(registeredCategoryIds);

  return (
    <form action={onSubmit} className="space-y-6">
      <Section title="부문 선택">
        <div className="space-y-2">
          {categories.map((c) => {
            const isRegistered = registeredSet.has(c.id);
            const isClosed = Boolean(c.closesAt && new Date(c.closesAt) < new Date());
            const disabled = isRegistered || isClosed;

            return (
              <label
                key={c.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  disabled
                    ? "cursor-not-allowed border-border opacity-50"
                    : "border-border bg-muted/30 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                }`}
              >
                <input
                  type="radio"
                  name="categoryId"
                  value={c.id}
                  required
                  disabled={disabled}
                  checked={selectedId === c.id}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{c.name}</p>
                    {c.registrationFee !== null && c.registrationFee > 0 && (
                      <span className="text-xs font-bold text-accent">
                        {c.registrationFee.toLocaleString()}원
                      </span>
                    )}
                  </div>
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
                  </div>
                  {isRegistered && (
                    <p className="mt-2 text-xs text-emerald-300">✓ 이미 신청한 부문</p>
                  )}
                  {isClosed && <p className="mt-2 text-xs text-red-300">신청 마감</p>}
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      {needsPartner && (
        <Section title="파트너">
          <input
            type="text"
            name="partnerName"
            required
            maxLength={120}
            placeholder="파트너 닉네임 또는 본명"
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            상대 측도 별도 신청해야 합니다 (각자 신청 + 서로 멘션 권장)
          </p>
        </Section>
      )}

      {needsCrew && (
        <Section title="크루명">
          <input
            type="text"
            name="crewName"
            required
            maxLength={120}
            placeholder="크루 이름 (대표자 1명만 신청)"
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </Section>
      )}

      <Section title="메모 (선택)">
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="주최자에게 전달할 추가 정보"
          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </Section>

      {selected?.paymentInstruction && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
          <p className="font-bold text-amber-300">참가비 결제 안내</p>
          <p className="mt-2 whitespace-pre-wrap text-amber-200">{selected.paymentInstruction}</p>
        </div>
      )}

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !selectedId}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "신청 중..." : "참가 신청"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
