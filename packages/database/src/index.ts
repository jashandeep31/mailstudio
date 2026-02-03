import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { testTable, usersTable } from "./schema/users.js";
import { accountsTable } from "./schema/accounts.js";
export * from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, {
  schema: { usersTable, accountsTable, testTable },
});

// Just for the testing purposes
// await db.insert(testTable).values({
//   name: "test",
// });

export * from "./schema/accounts.js";
export * from "./schema/users.js";
export * from "./schema/chats.js";
export * from "./schema/brand-kits.js";
export * from "./schema/chat-categories.js";
export * from "./schema/chat-media.js";
export * from "./schema/user-test-mails.js";
export * from "./schema/user-otps.js";
export * from "./schema/credit-wallets.js";
export * from "./schema/plans.js";
export * from "./schema/payments.js";
export * from "./schema/billings.js";
export * from "./schema/upload-media.js";
export * from "./schema/user-liked-chats.js";
