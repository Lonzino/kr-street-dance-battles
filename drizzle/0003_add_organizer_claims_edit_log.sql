CREATE TABLE "edit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"battle_id" uuid NOT NULL,
	"user_id" uuid,
	"changes" jsonb NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizer_claims" (
	"user_id" uuid NOT NULL,
	"battle_id" uuid NOT NULL,
	"verified_at" timestamp with time zone,
	"verified_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizer_claims_user_id_battle_id_pk" PRIMARY KEY("user_id","battle_id")
);
--> statement-breakpoint
ALTER TABLE "edit_log" ADD CONSTRAINT "edit_log_battle_id_battles_id_fk" FOREIGN KEY ("battle_id") REFERENCES "public"."battles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edit_log" ADD CONSTRAINT "edit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizer_claims" ADD CONSTRAINT "organizer_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizer_claims" ADD CONSTRAINT "organizer_claims_battle_id_battles_id_fk" FOREIGN KEY ("battle_id") REFERENCES "public"."battles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "edit_log_battle_idx" ON "edit_log" USING btree ("battle_id");--> statement-breakpoint
CREATE INDEX "organizer_claims_battle_idx" ON "organizer_claims" USING btree ("battle_id");--> statement-breakpoint
CREATE INDEX "organizer_claims_user_idx" ON "organizer_claims" USING btree ("user_id");