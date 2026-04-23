import { z } from "zod";
import { DanceGenre, Region } from "./enums";

export const UserRole = z.enum(["user", "organizer", "admin"]);
export type UserRole = z.infer<typeof UserRole>;

export const User = z.object({
  id: z.uuid(),
  email: z.email().nullable(),
  nickname: z
    .string()
    .min(2)
    .max(24)
    .regex(/^[a-zA-Z0-9_가-힣]+$/, "영숫자·언더스코어·한글만 허용")
    .nullable(),
  bio: z.string().max(500).nullable(),
  region: Region.nullable(),
  primaryGenres: z.array(DanceGenre).max(5).nullable(),
  instagramHandle: z
    .string()
    .max(40)
    .regex(/^[a-zA-Z0-9._]+$/, "인스타 핸들 형식")
    .nullable(),
  avatarUrl: z.url().nullable(),
  role: UserRole,
  approvedSubmissions: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type User = z.infer<typeof User>;

/**
 * 사용자 입력 스키마 — /profile 폼에서 사용.
 * id, email, role, approvedSubmissions, createdAt, updatedAt은 사용자가 못 바꿈.
 */
export const UserProfileInput = User.pick({
  nickname: true,
  bio: true,
  region: true,
  primaryGenres: true,
  instagramHandle: true,
}).partial();
export type UserProfileInput = z.infer<typeof UserProfileInput>;
