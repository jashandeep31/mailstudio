import { pgTable, uuid, pgEnum, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const accountProviderEnum = pgEnum("provider", [
  "google",
  "credentials",
]);

export const accountTable = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  provider: accountProviderEnum("provider").notNull(),
  blocked: boolean().notNull().default(false),

  last_login: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
});
