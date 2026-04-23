"use client";

import { useTransition } from "react";
import type { BattleCategory, PaymentStatus, Registration, RegistrationStatus } from "@/schema";
import { setPaymentStatus, setRegistrationStatus } from "./actions";

const STATUS_LABEL: Record<RegistrationStatus, string> = {
  pending: "대기",
  confirmed: "승인",
  waitlist: "대기열",
  cancelled: "취소",
  checked_in: "체크인",
  no_show: "노쇼",
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  unpaid: "미입금",
  paid: "입금",
  waived: "면제",
  refunded: "환불",
};

export function RegistrationsPanel({
  battleId,
  battleSlug,
  category,
  registrations,
}: {
  battleId: string;
  battleSlug: string;
  category: BattleCategory;
  registrations: Array<Registration & { user: { nickname: string | null; email: string | null } }>;
}) {
  const [pending, start] = useTransition();

  const counts = registrations.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RegistrationStatus, number>,
  );

  function changeStatus(id: string, status: RegistrationStatus) {
    start(async () => {
      await setRegistrationStatus(id, battleId, battleSlug, status);
    });
  }
  function changePayment(id: string, payment: PaymentStatus) {
    start(async () => {
      await setPaymentStatus(id, battleId, battleSlug, payment);
    });
  }

  return (
    <article className="rounded-xl border border-border bg-muted/20 p-5">
      <header className="mb-3 flex items-baseline justify-between">
        <div>
          <h3 className="font-bold">{category.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            총 {registrations.length}건
            {category.maxParticipants !== null && ` / 정원 ${category.maxParticipants}`}
            {Object.entries(counts).map(([k, v]) => (
              <span key={k} className="ml-2">
                {STATUS_LABEL[k as RegistrationStatus]} {v}
              </span>
            ))}
          </p>
        </div>
      </header>

      {registrations.length === 0 ? (
        <p className="text-xs text-muted-foreground">아직 신청자가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="py-2">닉네임</th>
                <th className="py-2">상태</th>
                <th className="py-2">입금</th>
                <th className="py-2">파트너/크루</th>
                <th className="py-2">메모</th>
                <th className="py-2">신청</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-border/50 align-top">
                  <td className="py-2">
                    <p className="font-medium">{r.user.nickname ?? "—"}</p>
                    <p className="text-[10px] text-muted-foreground">{r.user.email}</p>
                  </td>
                  <td className="py-2">
                    <select
                      value={r.status}
                      onChange={(e) => changeStatus(r.id, e.target.value as RegistrationStatus)}
                      disabled={pending}
                      className="rounded border border-border bg-muted/40 px-2 py-1 text-xs"
                    >
                      {Object.entries(STATUS_LABEL).map(([k, l]) => (
                        <option key={k} value={k}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2">
                    <select
                      value={r.paymentStatus}
                      onChange={(e) => changePayment(r.id, e.target.value as PaymentStatus)}
                      disabled={pending}
                      className="rounded border border-border bg-muted/40 px-2 py-1 text-xs"
                    >
                      {Object.entries(PAYMENT_LABEL).map(([k, l]) => (
                        <option key={k} value={k}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2">
                    {r.partnerName && <p>👥 {r.partnerName}</p>}
                    {r.crewName && <p>🏴 {r.crewName}</p>}
                  </td>
                  <td className="max-w-[200px] py-2 text-muted-foreground">{r.note ?? "—"}</td>
                  <td className="py-2 text-[10px] text-muted-foreground">
                    {new Date(r.registeredAt).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
