import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { testTable, usersTable } from "./schema/users.js";
import { accountsTable } from "./schema/accounts.js";
import { chatCategoriesTable } from "./schema/chat-categories.js";
export * from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { usersTable, accountsTable, testTable, chatCategoriesTable },
});
// Just for the testing purposes
// await db.insert(testTable).values({
//   name: "test",
// });

export * from "./schema/accounts.js";
export * from "./schema/users.js";
export * from "./schema/chats.js";
export * from "./schema/chat-categories.js";
export * from "./schema/brand-kits.js";
export * from "./schema/chat-media.js";
export * from "./schema/user-test-mails.js";
export * from "./schema/user-otps.js";
