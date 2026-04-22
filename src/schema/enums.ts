import { z } from "zod";

export const DanceGenre = z.enum([
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
]);
export type DanceGenre = z.infer<typeof DanceGenre>;

export const BattleFormat = z.enum([
  "1v1",
  "2v2",
  "3v3",
  "4v4",
  "5v5",
  "7toSmoke",
  "crewBattle",
  "showcase",
  "cypher",
]);
export type BattleFormat = z.infer<typeof BattleFormat>;

export const BattleStatus = z.enum([
  "upcoming",
  "registration",
  "ongoing",
  "finished",
  "cancelled",
]);
export type BattleStatus = z.infer<typeof BattleStatus>;

export const Region = z.enum([
  "seoul",
  "gyeonggi",
  "incheon",
  "busan",
  "daegu",
  "daejeon",
  "gwangju",
  "ulsan",
  "sejong",
  "gangwon",
  "chungbuk",
  "chungnam",
  "jeonbuk",
  "jeonnam",
  "gyeongbuk",
  "gyeongnam",
  "jeju",
  "online",
]);
export type Region = z.infer<typeof Region>;

export const SourceType = z.enum([
  "instagram",
  "youtube",
  "tiktok",
  "official_site",
  "news_article",
  "community_submission",
  "manual",
]);
export type SourceType = z.infer<typeof SourceType>;

export const RecordStatus = z.enum([
  "raw",
  "parsed",
  "validated",
  "published",
  "rejected",
  "duplicate",
]);
export type RecordStatus = z.infer<typeof RecordStatus>;
