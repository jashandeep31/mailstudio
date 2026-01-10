import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const chatCategoriesTable = pgTable("chat_categories", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
