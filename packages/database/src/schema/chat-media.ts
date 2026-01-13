import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { chatsTable, chatVersionPromptsTable } from "./chats.js";

export const chatMediaTable = pgTable("chat_media", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),

  storage_path: text().notNull(),
  public_path: text(),

  user_id: uuid().references(() => usersTable.id, { onDelete: "cascade" }),
  chat_prompt_id: uuid().references(() => chatVersionPromptsTable.id, {
    onDelete: "cascade",
  }),

  created_at: timestamp("created_at").notNull().defaultNow(),
});
