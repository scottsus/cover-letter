CREATE TABLE IF NOT EXISTS "analytics" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"num_hits" integer DEFAULT 0,
	"num_generations" integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_id_idx" ON "analytics" ("id");