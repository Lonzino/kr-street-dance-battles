import { z } from "zod";
import { BattleFormat, BattleStatus, DanceGenre, Region } from "./enums";

export const Venue = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  region: Region,
  mapUrl: z.url().optional(),
});
export type Venue = z.infer<typeof Venue>;

export const PrizeTier = z.object({
  rank: z.string().min(1),
  amount: z.number().int().nonnegative().optional(),
  note: z.string().optional(),
});
export type PrizeTier = z.infer<typeof PrizeTier>;

export const BattleLink = z.object({
  label: z.string().min(1),
  url: z.url(),
  type: z.enum(["instagram", "youtube", "registration", "official", "tiktok", "other"]),
});
export type BattleLink = z.infer<typeof BattleLink>;

export const BattleResult = z.object({
  rank: z.number().int().positive(),
  dancer: z.string().optional(),
  crew: z.string().optional(),
});
export type BattleResult = z.infer<typeof BattleResult>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD format required");

export const Battle = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase, dash-separated"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  date: isoDate,
  endDate: isoDate.optional(),
  registrationDeadline: isoDate.optional(),
  genres: z.array(DanceGenre).min(1),
  formats: z.array(BattleFormat).min(1),
  status: BattleStatus,
  venue: Venue,
  organizer: z.string().min(1),
  judges: z.array(z.string()).optional(),
  prize: z.array(PrizeTier).optional(),
  entryFee: z.number().int().nonnegative().optional(),
  posterUrl: z.url().optional(),
  links: z.array(BattleLink).default([]),
  results: z.array(BattleResult).optional(),
  tags: z.array(z.string()).optional(),
});
export type Battle = z.infer<typeof Battle>;

export const BattleArray = z.array(Battle);
