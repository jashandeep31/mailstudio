import {
  chatCategoriesTable,
  db,
  usersTable,
  eq,
  creditWalletsTable,
} from "@repo/db";
import slugify from "slugify";
import { getMailCategory } from "./ai/mail/get-mail-category.js";
import { getCachedUserCreditWallet } from "./lib/redis/user-credit-wallet-cache.js";
/**
 * Test fuction to run the random things
 */
export async function test() {
  console.log("Test is fired 🔥 up ");

  // getMailCategory(`Create the mail template for the user email verification`);
  // const categoriesList = [
  //   "authentication",
  //   "account",
  //   "billing",
  //   "marketing",
  //   "notification",
  //   "support",
  //   "other",
  // ];
  //
  // for (const category of categoriesList) {
  //   console.log(category);
  //   await db.insert(chatCategoriesTable).values({
  //     name: category,
  //     slug: slugify.default(category),
  //   });
  // }
}
