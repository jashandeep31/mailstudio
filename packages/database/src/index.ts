import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./schema/users.js";

export const db = drizzle(process.env.DATABASE_URL!);
