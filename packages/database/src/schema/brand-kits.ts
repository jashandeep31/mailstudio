import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const brandKitsTable = pgTable("brand_kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),

  brand_summary: text(),
  brand_design_style: text(),

  website_url: varchar({ length: 255 }).notNull(),
  address: text(),
  copyright: text(),
  desclaimer: text(),

  logo_url: varchar({ length: 255 }),
  icon_logo_url: varchar({ length: 255 }),
  primary_color: varchar("primary_color", { length: 20 }),
  secondary_color: varchar("secondary_color", { length: 20 }),
  accent_color: varchar("accent_color", { length: 20 }),

  font_family: varchar("font_family", { length: 100 }),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
