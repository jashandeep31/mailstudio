import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { brandKitsTable } from "./brand-kits.js";
import { chatCategoriesTable } from "./chat-categories.js";

export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  thumbnail: text("thumbnail"),
  public: boolean("public").notNull().default(false),
  price: numeric("price", {
    precision: 5,
    scale: 2,
  })
    .notNull()
    .default("0"),
  like_count: integer("like_count").notNull().default(0),
  category_id: uuid("category_id").references(() => chatCategoriesTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatVersionsTable = pgTable("chat_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
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
  version_number: integer("version_number").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatVersionPromptsTable = pgTable("chat_version_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  version_id: uuid("version_id")
    .notNull()
    .unique()
    .references(() => chatVersionsTable.id, {
      onDelete: "cascade",
    }),
  prompt: text("prompt").notNull(),
  brand_kit_id: uuid("brand_kit_id").references(() => brandKitsTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatVersionOutputsTable = pgTable("chat_version_outputs", {
  id: uuid("id").defaultRandom().primaryKey(),
  version_id: uuid("version_id")
    .notNull()
    .unique()
    .references(() => chatVersionsTable.id, {
      onDelete: "cascade",
    }),
  overview: text("overview"),
  mjml_code: text().notNull(),
  html_code: text().notNull(),
  generation_instructions: text(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
