CREATE TYPE "public"."user_role" AS ENUM('user', 'organizer', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"nickname" text,
	"bio" text,
	"region" "region",
	"primary_genres" "dance_genre"[],
	"instagram_handle" text,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"approved_submissions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_nickname_uniq" ON "users" USING btree ("nickname");