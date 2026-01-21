import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { and, chatsTable, db, eq } from "@repo/db";

export const getMarketplaceTemplates = catchAsync(
  async (req: Request, res: Response) => {
    const templates = await db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.public, true)));

    res.status(200).json({ data: templates });
  },
);
