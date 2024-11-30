ALTER TABLE "users" ALTER COLUMN "phone_number" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;