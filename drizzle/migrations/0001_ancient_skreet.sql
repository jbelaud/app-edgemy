CREATE TYPE "session_status" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');--> statement-breakpoint
CREATE TABLE "coaching_session" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"status" "session_status" DEFAULT 'PENDING' NOT NULL,
	"discord_channel_id" text,
	"notes" text,
	"video_replay_url" text,
	"objectives" text,
	"feedback" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_player_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_coach_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payment" DROP CONSTRAINT "payment_session_id_session_id_fk";
--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "review_session_id_session_id_fk";
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_organization_id" text;--> statement-breakpoint
ALTER TABLE "coaching_session" ADD CONSTRAINT "coaching_session_player_id_user_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coaching_session" ADD CONSTRAINT "coaching_session_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_session_id_coaching_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."coaching_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_session_id_coaching_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."coaching_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "player_id";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "coach_id";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "scheduled_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "duration";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "discord_channel_id";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "video_replay_url";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "objectives";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "feedback";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");