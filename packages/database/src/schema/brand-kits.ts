import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const brandKitsTable = pgTable("brand_kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  primary_color: varchar("primary_color", { length: 20 }),
  secondary_color: varchar("secondary_color", { length: 20 }),
  accent_color: varchar("accent_color", { length: 20 }),
  font_family: varchar("font_family", { length: 100 }),
  logo_url: text("logo_url"),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
