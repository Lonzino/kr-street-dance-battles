"use client";

import { useState, useTransition } from "react";
import { approveRecord, rejectRecord } from "./actions";

export function ReviewActions({
  recordId,
  initialPayload,
}: {
  recordId: string;
  initialPayload: string;
}) {
  const [payload, setPayload] = useState(initialPayload);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function approve() {
    setError(null);
    start(async () => {
      try {
        const parsed = JSON.parse(payload);
        await approveRecord(recordId, parsed);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function reject() {
    setError(null);
    start(async () => {
      try {
        await rejectRecord(recordId);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        rows={Math.min(20, payload.split("\n").length + 1)}
        spellCheck={false}
        className="w-full overflow-x-auto rounded bg-black/30 p-3 font-mono text-xs leading-relaxed focus:outline focus:outline-1 focus:outline-accent"
      />

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={approve}
          disabled={pending}
          className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "처리중…" : "✓ 승인 → 공개"}
        </button>
        <button
          type="button"
          onClick={reject}
          disabled={pending}
          className="rounded-md border border-red-500/40 px-4 py-2 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          ✗ 거부
        </button>
      </div>
    </div>
  );
}
