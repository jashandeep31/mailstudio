import { r2RemoveObject } from "./lib/configs/r2-config.js";

export async function test() {
  console.log("Test is fired 🔥 up ");

  await r2RemoveObject("https://public.mailstudio.dev/icon.jpg");
  // getMailCategory(`Create the mail template for the user email verification`);
  // const categoriesList = [
  //   "authentication",
  //   "account",
  //   "billing",
  //   "marketing",
  //   "notification",
  //   "support",
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
