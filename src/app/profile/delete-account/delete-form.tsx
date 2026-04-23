"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "./actions";

export function DeleteAccountForm({ email }: { email: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  const matches = confirmInput.trim().toLowerCase() === email.toLowerCase();

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await deleteAccount(formData);
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        확인을 위해 본인 이메일{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{email}</code>을 정확히
        입력해주세요.
      </p>

      <input
        type="email"
        name="confirmEmail"
        value={confirmInput}
        onChange={(e) => setConfirmInput(e.target.value)}
        placeholder={email}
        required
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
      />

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !matches}
        className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-30"
      >
        {pending ? "삭제 중..." : "영구 탈퇴"}
      </button>
    </form>
  );
}
