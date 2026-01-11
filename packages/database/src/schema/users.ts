import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { planTypeEnum } from "./plans.js";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  avatar: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  role: userRoleEnum().default("user"),

  plan_type: planTypeEnum().default("free"),

  updated_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});
export const testTable = pgTable("tests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});
