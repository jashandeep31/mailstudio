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

export const planTypeEnum = pgEnum("plan_type", ["free", "pro", "pro_plus"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "on_hold",
  "active",
  "canceled",
  "paused",
  "unpaid",
]);

export const plansTable = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  plan_type: planTypeEnum().notNull(),
  subscription_status: subscriptionStatusEnum().notNull().default("unpaid"),
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  subscription_id: varchar("subscription_id"),
  customer_id: varchar("customer_id", { length: 255 }), // sub_*

  price: numeric("price").notNull(),

  active_from: timestamp("active_from").notNull(),
  renew_at: timestamp("renew_at").notNull(),
  ends_at: timestamp("ends_at"),
  cancel_at_next_billing_date: boolean("cancel_at_next_billing_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
