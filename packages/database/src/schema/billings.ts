import { pgTable, uuid, timestamp, numeric } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { planTypeEnum } from "./plans.js";
import { paymentTransactionsTable } from "./payments.js";

export const billingsTable = pgTable("billings", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric("amount", {
    precision: 10,
    scale: 2,
  }),
  payment_transaction_id: uuid().references(() => paymentTransactionsTable.id, {
    onDelete: "set null",
  }),

  plan_type: planTypeEnum().notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
