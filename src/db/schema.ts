import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ────────────────────────────────────────────────
// Postgres ENUMs — Zod enum과 1:1 매칭
// ────────────────────────────────────────────────

export const danceGenreEnum = pgEnum("dance_genre", [
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

export const battleFormatEnum = pgEnum("battle_format", [
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

export const battleStatusEnum = pgEnum("battle_status", [
  "upcoming",
  "registration",
  "ongoing",
  "finished",
  "cancelled",
]);

export const regionEnum = pgEnum("region", [
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

export const recordStatusEnum = pgEnum("record_status", [
  "raw",
  "parsed",
  "validated",
  "published",
  "rejected",
  "duplicate",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "instagram",
  "youtube",
  "tiktok",
  "official_site",
  "news_article",
  "community_submission",
  "manual",
]);

// ────────────────────────────────────────────────
// crews — battles보다 먼저 선언 (battles에서 참조 가능)
// ────────────────────────────────────────────────

export const crews = pgTable(
  "crews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    koreanName: text("korean_name"),
    foundedYear: integer("founded_year"),
    region: regionEnum("region").notNull(),
    genres: danceGenreEnum("genres").array().notNull(),
    leader: text("leader"),
    members: text("members").array(),
    description: text("description"),
    instagramUrl: text("instagram_url"),
    youtubeUrl: text("youtube_url"),
    tags: text("tags").array(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [uniqueIndex("crews_slug_uniq").on(t.slug)],
);

// ────────────────────────────────────────────────
// source_records (앞으로 선언 — battles에서 FK 참조)
// ────────────────────────────────────────────────

export const sourceRecords = pgTable(
  "source_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    sourceUrl: text("source_url").notNull(),
    sourceId: text("source_id").notNull(),
    rawContent: text("raw_content").notNull(),
    rawMetadata: jsonb("raw_metadata"),

    status: recordStatusEnum("status").notNull().default("raw"),
    parsedPayload: jsonb("parsed_payload"),
    parseConfidence: real("parse_confidence"),
    parseModel: text("parse_model"),
    parseWarnings: text("parse_warnings").array(),

    // FK는 battles 선언 후 별도 ALTER로 (순환 참조 회피).
    // Drizzle에서는 .references()를 양방향에서 동시에 못 거니까 한쪽만 정의.
    parsedBattleId: uuid("parsed_battle_id"),

    reviewerNote: text("reviewer_note"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("source_records_source_uniq").on(t.sourceType, t.sourceId),
    index("source_records_status_idx").on(t.status),
  ],
);

// ────────────────────────────────────────────────
// battles
// ────────────────────────────────────────────────

export const battles = pgTable(
  "battles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    date: text("date").notNull(),
    endDate: text("end_date"),
    registrationDeadline: text("registration_deadline"),

    genres: danceGenreEnum("genres").array().notNull(),
    formats: battleFormatEnum("formats").array().notNull(),
    status: battleStatusEnum("status").notNull(),

    // venue는 region+name+address 복합 객체. region은 jsonb 안에서 enum 값 강제 (Zod로).
    venue: jsonb("venue").notNull().$type<{
      name: string;
      address: string;
      region:
        | "seoul"
        | "gyeonggi"
        | "incheon"
        | "busan"
        | "daegu"
        | "daejeon"
        | "gwangju"
        | "ulsan"
        | "sejong"
        | "gangwon"
        | "chungbuk"
        | "chungnam"
        | "jeonbuk"
        | "jeonnam"
        | "gyeongbuk"
        | "gyeongnam"
        | "jeju"
        | "online";
      mapUrl?: string;
    }>(),

    organizer: text("organizer").notNull(),
    judges: text("judges").array(),
    prize: jsonb("prize").$type<Array<{ rank: string; amount?: number; note?: string }>>(),
    entryFee: integer("entry_fee"),
    posterUrl: text("poster_url"),
    links: jsonb("links").notNull().default([]).$type<
      Array<{
        label: string;
        url: string;
        type: "instagram" | "youtube" | "registration" | "official" | "tiktok" | "other";
      }>
    >(),
    results: jsonb("results").$type<Array<{ rank: number; dancer?: string; crew?: string }>>(),
    tags: text("tags").array(),

    isPublished: boolean("is_published").notNull().default(false),

    sourceRecordId: uuid("source_record_id").references(() => sourceRecords.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("battles_slug_uniq").on(t.slug),
    index("battles_date_idx").on(t.date),
    index("battles_status_idx").on(t.status),
    index("battles_published_idx").on(t.isPublished),
  ],
);
