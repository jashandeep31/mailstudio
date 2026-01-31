import { chatCategoriesTable, db } from "./index.js";

const categoriesList = [
  "authentication",
  "account",
  "billing",
  "marketing",
  "notification",
  "support",
];

export async function main() {
  console.log(`Database is seeded `);
  for (const category of categoriesList) {
    await db
      .insert(chatCategoriesTable)
      .values({
        name: category.toUpperCase(),
        slug: category,
      })
      .onConflictDoNothing();
  }
}
