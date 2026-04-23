import { z } from "zod";
import { BattleFormat, DanceGenre } from "./enums";

export const RegistrationStatus = z.enum([
  "pending",
  "confirmed",
  "waitlist",
  "cancelled",
  "checked_in",
  "no_show",
]);
export type RegistrationStatus = z.infer<typeof RegistrationStatus>;

export const PaymentStatus = z.enum(["unpaid", "paid", "waived", "refunded"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const BattleCategory = z.object({
  id: z.uuid(),
  battleId: z.uuid(),
  name: z.string().min(1).max(80),
  genres: z.array(DanceGenre).min(1),
  format: BattleFormat,
  maxParticipants: z.number().int().positive().nullable(),
  registrationFee: z.number().int().nonnegative().nullable(),
  paymentInstruction: z.string().max(2000).nullable(),
  closesAt: z.iso.datetime().nullable(),
  sortOrder: z.number().int().nonnegative(),
});
export type BattleCategory = z.infer<typeof BattleCategory>;

/** /admin에서 카테고리 추가/수정 시 사용 */
export const BattleCategoryInput = BattleCategory.pick({
  name: true,
  genres: true,
  format: true,
  maxParticipants: true,
  registrationFee: true,
  paymentInstruction: true,
  closesAt: true,
});
export type BattleCategoryInput = z.infer<typeof BattleCategoryInput>;

export const Registration = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  userId: z.uuid(),
  status: RegistrationStatus,
  paymentStatus: PaymentStatus,
  partnerName: z.string().max(120).nullable(),
  crewName: z.string().max(120).nullable(),
  note: z.string().max(500).nullable(),
  organizerNote: z.string().max(500).nullable(),
  checkInToken: z.string(),
  registeredAt: z.iso.datetime(),
  confirmedAt: z.iso.datetime().nullable(),
  checkedInAt: z.iso.datetime().nullable(),
  cancelledAt: z.iso.datetime().nullable(),
});
export type Registration = z.infer<typeof Registration>;

/** 사용자가 신청 시 입력하는 필드 */
export const RegistrationInput = z.object({
  categoryId: z.uuid(),
  partnerName: z.string().max(120).optional(),
  crewName: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});
export type RegistrationInput = z.infer<typeof RegistrationInput>;
