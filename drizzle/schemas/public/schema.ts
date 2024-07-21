import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const analytics = pgTable("analytics", {
    id: text("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
    numHits: integer("num_hits").default(0),
    numGenerations: integer("num_generations").default(0),
},
(table) => {
    return {
        idIdx: index("analytics_id_idx").on(table.id),
    }
})

export const generations = pgTable("generations", {
    id: text("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
    resume: text("resume"),
    linkedInProfile: text("linkedin_profile"),
    jobPosting: text("job_posting"),
    prompt: text("prompt"),
    createdAt: timestamp("created_at", { mode: "string", precision: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string", precision: 3 }).defaultNow().notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
},
(table) => {
    return {
        idIdx: index("generations_id_idx").on(table.id),
    }
})
