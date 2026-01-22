import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { and, gt, chatsTable, db, eq } from "@repo/db";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";

export const getMarketplaceTemplates = catchAsync(
  async (req: Request, res: Response) => {
    console.log(JSON.stringify(req.query));
    const { categoryId, type, query } =
      getMarketplaceTemplatesFilterSchema.parse(req.query);

    const dbQuery = [eq(chatsTable.public, true)];

    if (categoryId) {
      dbQuery.push(eq(chatsTable.category_id, categoryId));
    }
    if (type == "free") {
      dbQuery.push(eq(chatsTable.price, String(0)));
    }
    if (type == "premium") {
      dbQuery.push(gt(chatsTable.price, String(0)));
    }
    const templates = await db
      .select()
      .from(chatsTable)
      .where(and(...dbQuery));

    res.status(200).json({ data: templates });
  },
);
