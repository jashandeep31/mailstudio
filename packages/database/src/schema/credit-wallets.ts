import {
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const creditWalletsTable = pgTable("credit-wallets", {
  id: uuid().defaultRandom().primaryKey(),
  balance: numeric("balance", {
    precision: 10,
    scale: 2,
  }),

  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "spent",
  "grant",
  "expire",
]);
export const creditTransactionsTable = pgTable("credit_transactions", {
  id: uuid().defaultRandom().primaryKey(),
  wallet_id: uuid("wallet_id")
    .notNull()
    .references(() => creditWalletsTable.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  amount: numeric("balance", {
    precision: 10,
    scale: 2,
  }),
  after_balance: numeric("after_balance", {
    precision: 10,
    scale: 2,
  }),

  type: creditTransactionTypeEnum().notNull(),
  reason: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
