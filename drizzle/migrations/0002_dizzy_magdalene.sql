ALTER TABLE "coaching_session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "coaching_session" CASCADE;--> statement-breakpoint
DROP TABLE "payment" CASCADE;--> statement-breakpoint
DROP TABLE "review" CASCADE;--> statement-breakpoint
ALTER TABLE "coach_profile" ALTER COLUMN "is_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "experience";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "formats";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "abi";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "languages";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "achievements";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "hourly_rate";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "coaching_types";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "rating_avg";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "rating_count";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "total_sessions";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "subscription_plan";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "subscription_expires_at";--> statement-breakpoint
ALTER TABLE "coach_profile" DROP COLUMN "metadata";--> statement-breakpoint
DROP TYPE "public"."coach_subscription_plan";--> statement-breakpoint
DROP TYPE "public"."coaching_type";--> statement-breakpoint
DROP TYPE "public"."edgemy_role";--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
DROP TYPE "public"."poker_format";--> statement-breakpoint
DROP TYPE "public"."session_status";