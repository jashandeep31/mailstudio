import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { and, chatsTable, db, eq } from "@repo/db";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";

export const getMarketplaceTemplates = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId, type, query } =
      getMarketplaceTemplatesFilterSchema.parse(req.query);

    const templates = await db
      .select()
      .from(chatsTable)
      .where(
        and(
          eq(chatsTable.public, true),
          categoryId ? eq(chatsTable.category_id, categoryId) : undefined,
        ),
      );

    res.status(200).json({ data: templates });
  },
);
