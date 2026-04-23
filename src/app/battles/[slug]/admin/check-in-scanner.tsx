"use client";

import { useState, useTransition } from "react";
import { performCheckIn } from "./actions";

/**
 * QR 코드 스캐너 — MVP는 토큰 텍스트 입력 또는 QR URL 붙여넣기.
 * 실제 QR 스캔은 모바일 카메라 → URL 클릭 → /admin/check-in/[token] 별도 페이지가 처리.
 * 이 컴포넌트는 데스크탑에서 토큰 수동 입력용.
 */
export function CheckInScanner({ battleId, battleSlug }: { battleId: string; battleSlug: string }) {
  const [pending, start] = useTransition();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<
    | { type: "success"; nickname: string | null; categoryName: string; alreadyChecked: boolean }
    | { type: "error"; message: string }
    | null
  >(null);

  function onCheckIn() {
    setResult(null);
    if (!input.trim()) return;

    // URL이면 토큰 추출, 아니면 그대로
    let token = input.trim();
    const m = token.match(/\/check-in\/([^/?#]+)/);
    if (m) token = m[1];

    start(async () => {
      const res = await performCheckIn(battleId, battleSlug, token);
      if (res.ok) {
        setResult({
          type: "success",
          nickname: res.nickname,
          categoryName: res.categoryName,
          alreadyChecked: res.alreadyChecked,
        });
        setInput("");
      } else {
        setResult({ type: "error", message: res.error });
      }
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        참가자의 QR 코드를 스마트폰 카메라로 스캔하거나, 데스크탑에서 토큰을 직접 입력하세요.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="QR URL 또는 토큰 붙여넣기"
          className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCheckIn();
            }
          }}
        />
        <button
          type="button"
          onClick={onCheckIn}
          disabled={pending || !input.trim()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "확인중..." : "체크인"}
        </button>
      </div>

      {result?.type === "success" && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            result.alreadyChecked
              ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {result.alreadyChecked ? "⚠️ 이미 체크인된 참가자" : "✓ 체크인 완료"}
          <p className="mt-1 text-xs opacity-90">
            {result.nickname ?? "(닉네임 없음)"} · {result.categoryName}
          </p>
        </div>
      )}

      {result?.type === "error" && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {result.message}
        </p>
      )}
    </div>
  );
}
