import {
  boolean,
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const OtpTypeEnum = pgEnum("otp_type_enum", [
  "MAIL_VALIDATION",
  "PASSWORD_RESET",
  "PHONE_VERIFICATION",
]);

export const userOtpsTable = pgTable("user_otps", {
  id: uuid().defaultRandom().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  otp: varchar({ length: 255 }).notNull(),
  verification_key: varchar({ length: 255 }).notNull(),
  used: boolean().default(false),
  used_at: timestamp().notNull().defaultNow(),
  otp_type: OtpTypeEnum(),
  created_at: timestamp().notNull().defaultNow(),
  expires_at: timestamp().notNull().defaultNow(),
});
