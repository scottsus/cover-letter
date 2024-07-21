CREATE TABLE IF NOT EXISTS "generations" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume" text,
	"linkedin_profile" text,
	"job_posting" text,
	"prompt" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "generations_id_idx" ON "generations" ("id");