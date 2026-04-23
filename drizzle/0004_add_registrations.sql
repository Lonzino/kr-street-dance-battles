CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'paid', 'waived', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('pending', 'confirmed', 'waitlist', 'cancelled', 'checked_in', 'no_show');--> statement-breakpoint
CREATE TABLE "battle_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"battle_id" uuid NOT NULL,
	"name" text NOT NULL,
	"genres" "dance_genre"[] NOT NULL,
	"format" "battle_format" NOT NULL,
	"max_participants" integer,
	"registration_fee" integer,
	"payment_instruction" text,
	"closes_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "registration_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"partner_name" text,
	"crew_name" text,
	"note" text,
	"organizer_note" text,
	"check_in_token" text NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"checked_in_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "battle_categories" ADD CONSTRAINT "battle_categories_battle_id_battles_id_fk" FOREIGN KEY ("battle_id") REFERENCES "public"."battles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_category_id_battle_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."battle_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "battle_categories_battle_idx" ON "battle_categories" USING btree ("battle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_user_category_uniq" ON "registrations" USING btree ("user_id","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_token_uniq" ON "registrations" USING btree ("check_in_token");--> statement-breakpoint
CREATE INDEX "registrations_category_idx" ON "registrations" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "registrations_user_idx" ON "registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "registrations_status_idx" ON "registrations" USING btree ("status");