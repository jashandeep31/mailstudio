import {
  pgEnum,
  pgTable,
  uuid,
  timestamp,
  boolean,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const planTypeEnum = pgEnum("plan_type", ["free", "starter_pack"]);

export const plansTable = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  plan_type: planTypeEnum().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id),

  active: boolean("active").notNull(),
  subscription_id: varchar("subscription_id"),

  price: numeric("price").notNull(),

  active_from: timestamp("active_from").notNull(),
  renew_at: timestamp("renew_at").notNull(),
  ends_at: timestamp("ends_at"),
  cancel_at_next_billing_date: boolean("cancel_at_next_billing_date").notNull(),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
