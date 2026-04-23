import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
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

export const userRoleEnum = pgEnum("user_role", ["user", "organizer", "admin"]);

// ────────────────────────────────────────────────
// users — Supabase auth.users.id를 PK로 (Auth와 1:1)
// ────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    // Supabase auth.users.id와 동일. FK는 RLS·트리거로 별도 보장.
    id: uuid("id").primaryKey(),
    email: text("email"),
    nickname: text("nickname"),
    bio: text("bio"),
    region: regionEnum("region"),
    primaryGenres: danceGenreEnum("primary_genres").array(),
    instagramHandle: text("instagram_handle"),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("user"),
    /** 셀프 등록 승인 누적 카운트 — 3회 이상이면 화이트리스트 즉시 게시 가능. */
    approvedSubmissions: integer("approved_submissions").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [uniqueIndex("users_nickname_uniq").on(t.nickname)],
);

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
    aliases: text("aliases").array(),
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

// ────────────────────────────────────────────────
// notification_channel enum
// ────────────────────────────────────────────────

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "web_push",
  "discord",
]);

// ────────────────────────────────────────────────
// bookmarks — 사용자가 관심 표시한 배틀
// ────────────────────────────────────────────────

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    battleId: uuid("battle_id")
      .notNull()
      .references(() => battles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.battleId] }),
    index("bookmarks_user_idx").on(t.userId),
    index("bookmarks_battle_idx").on(t.battleId),
  ],
);

// ────────────────────────────────────────────────
// notification_prefs — 사용자별 알림 설정
// ────────────────────────────────────────────────

export const notificationPrefs = pgTable("notification_prefs", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  channels: notificationChannelEnum("channels").array().notNull().default(["email"]),
  /** null = 모든 지역 */
  regions: regionEnum("regions").array(),
  /** null = 모든 장르 */
  genres: danceGenreEnum("genres").array(),
  /** 며칠 전 사전 알림 */
  leadDays: integer("lead_days").notNull().default(3),
  /** 주간 다이제스트 메일 */
  weeklyDigest: boolean("weekly_digest").notNull().default(true),
  /** 북마크한 배틀 변경 알림 */
  bookmarkAlerts: boolean("bookmark_alerts").notNull().default(true),
  /** 마지막 일일 알림 발송 시각 — 중복 발송 방지 */
  lastDailySentAt: timestamp("last_daily_sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// ────────────────────────────────────────────────
// organizer_claims — 주최자가 특정 배틀의 편집권 보유
// ────────────────────────────────────────────────

export const organizerClaims = pgTable(
  "organizer_claims",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    battleId: uuid("battle_id")
      .notNull()
      .references(() => battles.id, { onDelete: "cascade" }),
    /** 운영자가 검증 완료한 시점 (pending이면 null) */
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    /** 검증한 운영자 식별자 (admin user id 또는 admin@system) */
    verifiedBy: text("verified_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.battleId] }),
    index("organizer_claims_battle_idx").on(t.battleId),
    index("organizer_claims_user_idx").on(t.userId),
  ],
);

// ────────────────────────────────────────────────
// edit_log — 배틀 수정 이력 (스팸·분쟁 추적)
// ────────────────────────────────────────────────

export const editLog = pgTable(
  "edit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    battleId: uuid("battle_id")
      .notNull()
      .references(() => battles.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    /** 변경된 필드 → 이전 값 / 새 값 */
    changes: jsonb("changes").notNull().$type<Record<string, { from: unknown; to: unknown }>>(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("edit_log_battle_idx").on(t.battleId)],
);

// ────────────────────────────────────────────────
// Phase A — 참가 신청 시스템
// ────────────────────────────────────────────────

export const registrationStatusEnum = pgEnum("registration_status", [
  "pending", // 신청 후 주최자 승인 대기
  "confirmed", // 승인 완료
  "waitlist", // 정원 초과 — 대기
  "cancelled", // 취소 (사용자 또는 주최자)
  "checked_in", // 현장 체크인 완료
  "no_show", // 노쇼
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid", // 미입금
  "paid", // 입금 확인 (주최자가 수동 마크)
  "waived", // 면제 (초청·관계자)
  "refunded", // 환불
]);

/**
 * 한 배틀의 부문 (1on1 비보잉, 2on2 올스타일 등 — 같은 날 여러 부문 가능).
 * 기존 battles.formats / battles.genres는 디스플레이 요약용 — 실제 신청은 categories로.
 */
export const battleCategories = pgTable(
  "battle_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    battleId: uuid("battle_id")
      .notNull()
      .references(() => battles.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // "1on1 비보잉", "2on2 올스타일"
    genres: danceGenreEnum("genres").array().notNull(),
    format: battleFormatEnum("format").notNull(),
    maxParticipants: integer("max_participants"), // null = 무제한
    registrationFee: integer("registration_fee"), // KRW (null = 무료)
    paymentInstruction: text("payment_instruction"), // 계좌번호 / 토스 링크 / 안내문
    closesAt: timestamp("closes_at", { withTimezone: true }), // 신청 마감 (null = 배틀 시작 직전)
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("battle_categories_battle_idx").on(t.battleId)],
);

/**
 * 사용자의 부문 참가 신청.
 * 같은 (userId, categoryId) 중복 신청 방지 (uniqueIndex).
 * checkInToken은 QR 코드로 인코딩 → 주최자가 스캔 → /admin/check-in/[token]
 */
export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => battleCategories.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: registrationStatusEnum("status").notNull().default("pending"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("unpaid"),
    /** 2on2 / 크루배틀용 파트너 이름 또는 회원 핸들 */
    partnerName: text("partner_name"),
    /** 크루배틀 시 크루명 */
    crewName: text("crew_name"),
    /** 사용자가 신청 시 남긴 메모 */
    note: text("note"),
    /** 주최자가 보는 메모 (참가자에게 안 보임) */
    organizerNote: text("organizer_note"),
    /** QR 체크인 토큰 — 신청 시 자동 생성, registrations.id의 HMAC */
    checkInToken: text("check_in_token").notNull(),
    registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    // 활성 신청만 unique — 취소(status='cancelled') 후 재신청 가능.
    // 안 하면 cancel 후 register-form에서 "신청 가능"으로 보이는데 INSERT 시 unique 위반.
    uniqueIndex("registrations_user_category_active_uniq")
      .on(t.userId, t.categoryId)
      .where(sql`status <> 'cancelled'`),
    uniqueIndex("registrations_token_uniq").on(t.checkInToken),
    index("registrations_category_idx").on(t.categoryId),
    index("registrations_user_idx").on(t.userId),
    index("registrations_status_idx").on(t.status),
  ],
);
