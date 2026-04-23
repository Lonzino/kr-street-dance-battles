CREATE TYPE "public"."battle_format" AS ENUM('1v1', '2v2', '3v3', '4v4', '5v5', '7toSmoke', 'crewBattle', 'showcase', 'cypher');--> statement-breakpoint
CREATE TYPE "public"."battle_status" AS ENUM('upcoming', 'registration', 'ongoing', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."dance_genre" AS ENUM('bboying', 'popping', 'locking', 'hiphop', 'house', 'krump', 'waacking', 'voguing', 'allstyle', 'mixed');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('raw', 'parsed', 'validated', 'published', 'rejected', 'duplicate');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('seoul', 'gyeonggi', 'incheon', 'busan', 'daegu', 'daejeon', 'gwangju', 'ulsan', 'sejong', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju', 'online');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('instagram', 'youtube', 'tiktok', 'official_site', 'news_article', 'community_submission', 'manual');--> statement-breakpoint
CREATE TABLE "battles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"date" text NOT NULL,
	"end_date" text,
	"registration_deadline" text,
	"genres" "dance_genre"[] NOT NULL,
	"formats" "battle_format"[] NOT NULL,
	"status" "battle_status" NOT NULL,
	"venue" jsonb NOT NULL,
	"organizer" text NOT NULL,
	"judges" text[],
	"prize" jsonb,
	"entry_fee" integer,
	"poster_url" text,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"results" jsonb,
	"tags" text[],
	"is_published" boolean DEFAULT false NOT NULL,
	"source_record_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"korean_name" text,
	"aliases" text[],
	"founded_year" integer,
	"region" "region" NOT NULL,
	"genres" "dance_genre"[] NOT NULL,
	"leader" text,
	"members" text[],
	"description" text,
	"instagram_url" text,
	"youtube_url" text,
	"tags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" "source_type" NOT NULL,
	"source_url" text NOT NULL,
	"source_id" text NOT NULL,
	"raw_content" text NOT NULL,
	"raw_metadata" jsonb,
	"status" "record_status" DEFAULT 'raw' NOT NULL,
	"parsed_payload" jsonb,
	"parse_confidence" real,
	"parse_model" text,
	"parse_warnings" text[],
	"parsed_battle_id" uuid,
	"reviewer_note" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_source_record_id_source_records_id_fk" FOREIGN KEY ("source_record_id") REFERENCES "public"."source_records"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "battles_slug_uniq" ON "battles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "battles_date_idx" ON "battles" USING btree ("date");--> statement-breakpoint
CREATE INDEX "battles_status_idx" ON "battles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "battles_published_idx" ON "battles" USING btree ("is_published");--> statement-breakpoint
CREATE UNIQUE INDEX "crews_slug_uniq" ON "crews" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "source_records_source_uniq" ON "source_records" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE INDEX "source_records_status_idx" ON "source_records" USING btree ("status");