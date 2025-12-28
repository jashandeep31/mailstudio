import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { brandKitsTabe } from "./brand-kits.js";

export const projectsTable = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  thumbnail: text(),
  name: varchar(),
  public: boolean().default(false),
  updated_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
});

export const projectVersionsTable = pgTable("project_versions", {
  id: uuid("id").defaultRandom().primaryKey(),

  project_id: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),

  versionNumber: integer("version_number").notNull(),

  updated_at: timestamp().notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const versionPromptsTable = pgTable("version_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  version_id: uuid("version_id")
    .notNull()
    .unique()
    .references(() => projectVersionsTable.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  // BrandKit
  brand_kit_id: uuid("brand_kit_id").references(() => brandKitsTabe.id, {
    onDelete: "cascade",
  }),
  // Images
  created_at: timestamp().notNull().defaultNow(),
});

export const versionOutputsTable = pgTable("version_outputs", {
  id: uuid("id").defaultRandom().primaryKey(),
  version_id: uuid("version_id")
    .notNull()
    .unique()
    .references(() => projectVersionsTable.id, {
      onDelete: "cascade",
    }),
  overview: text("overview"),
  output_code: text("output_code").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
