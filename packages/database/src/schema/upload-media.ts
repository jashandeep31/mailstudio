import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const uploadMediaTable = pgTable("upload_media", {
  id: uuid().primaryKey().defaultRandom(),
  signed_url: text().notNull(),
  used: boolean().notNull().default(false),
  key: varchar({ length: 255 }).notNull(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  exact_url: text().notNull(),
  deleted_at: timestamp("deleted_at"),
  deleted: boolean().notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
