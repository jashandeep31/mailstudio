import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { testTable, usersTable } from "./schema/users.js";
import { accountsTable } from "./schema/accounts.js";
export * from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { usersTable, accountsTable, testTable },
});
await db.insert(testTable).values({
  name: "test",
});

export * from "./schema/accounts.js";
export * from "./schema/users.js";
