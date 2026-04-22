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
    genres: text("genres").array().notNull(),
    formats: text("formats").array().notNull(),
    status: text("status").notNull(),
    venue: jsonb("venue").notNull(),
    organizer: text("organizer").notNull(),
    judges: text("judges").array(),
    prize: jsonb("prize"),
    entryFee: integer("entry_fee"),
    posterUrl: text("poster_url"),
    links: jsonb("links").notNull().default([]),
    results: jsonb("results"),
    tags: text("tags").array(),

    isPublished: boolean("is_published").notNull().default(false),
    sourceRecordId: uuid("source_record_id"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("battles_slug_uniq").on(t.slug),
    index("battles_date_idx").on(t.date),
    index("battles_status_idx").on(t.status),
    index("battles_published_idx").on(t.isPublished),
  ],
);

export const crews = pgTable(
  "crews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    koreanName: text("korean_name"),
    foundedYear: integer("founded_year"),
    region: text("region").notNull(),
    genres: text("genres").array().notNull(),
    leader: text("leader"),
    members: text("members").array(),
    description: text("description"),
    instagramUrl: text("instagram_url"),
    youtubeUrl: text("youtube_url"),
    tags: text("tags").array(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("crews_slug_uniq").on(t.slug)],
);

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

    parsedBattleId: uuid("parsed_battle_id"),
    reviewerNote: text("reviewer_note"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("source_records_source_uniq").on(t.sourceType, t.sourceId),
    index("source_records_status_idx").on(t.status),
  ],
);
