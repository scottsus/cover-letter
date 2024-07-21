import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./drizzle/schemas/**/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schemaFilter: ["public"],
} satisfies Config;
