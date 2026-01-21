import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { chatCategoriesTable, db } from "@repo/db";
import { redis } from "../../lib/db.js";

const KEY = `categories:all`;
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const cachedCategoreies = await redis.get(KEY);
  if (cachedCategoreies) {
    console.log(`redis db hit as passed`);
    res
      .status(200)
      .json({ success: true, data: JSON.parse(cachedCategoreies) });
    return;
  }
  const categoires = await db
    .select({
      name: chatCategoriesTable.name,
      slug: chatCategoriesTable.slug,
      id: chatCategoriesTable.id,
    })
    .from(chatCategoriesTable);
  await redis.set(KEY, JSON.stringify(categoires), "EX", 5 * 60);
  res.status(200).json({ success: true, data: categoires });
  return;
});
