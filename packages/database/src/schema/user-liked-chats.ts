import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { chatsTable } from "./chats.js";
import { usersTable } from "./users.js";

export const userLikedChatsTable = pgTable(
  "user_liked_chats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chat_id: uuid("chat_id")
      .notNull()
      .references(() => chatsTable.id, {
        onDelete: "cascade",
      }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userChatUnique: unique("user_chat_unique").on(table.user_id, table.chat_id),
  }),
);
