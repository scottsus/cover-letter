import { sql } from "drizzle-orm";
import { index, integer, pgTable, text } from "drizzle-orm/pg-core";

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
