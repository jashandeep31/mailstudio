import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "dodopayments",
  "stripe",
  "lemonsqueezy",
]);

export const paymentTransactionsTable = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  provider: paymentProviderEnum("provider").notNull(),

  payment_id: varchar("payment_id", { length: 255 }).notNull(), // pay_*
  invoice_id: varchar("invoice_id", { length: 255 }).notNull().unique(), // inv_*
  subscription_id: varchar("subscription_id", { length: 255 }), // sub_*
  customer_id: varchar("customer_id", { length: 255 }), // sub_*
  checkout_session_id: varchar("checkout_session_id", { length: 255 }),

  settlement_amount: numeric("settlement_amount", {
    precision: 10,
    scale: 2,
  }),

  tax_amount: numeric("tax_amount", {
    precision: 10,
    scale: 2,
  }),

  payment_method: varchar({ length: 200 }),
  card_last_four: varchar("card_last_four", { length: 4 }),
  card_network: varchar("card_network", { length: 50 }),
  card_type: varchar("card_type", { length: 50 }),

  status: paymentStatusEnum("status").notNull(),
  error_code: varchar("error_code", { length: 100 }),
  error_message: text("error_message"),

  provider_metadata: jsonb("provider_metadata"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
