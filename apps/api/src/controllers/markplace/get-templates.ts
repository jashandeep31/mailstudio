import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import {
  and,
  gt,
  chatsTable,
  db,
  eq,
  usersTable,
  chatCategoriesTable,
} from "@repo/db";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";
import { AppError } from "../../lib/app-error.js";

export const getMarketplaceTemplates = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId, type, query } =
      getMarketplaceTemplatesFilterSchema.parse(req.query);

    const dbQuery = [eq(chatsTable.public, true)];
    if (categoryId) dbQuery.push(eq(chatsTable.category_id, categoryId));
    if (type == "free") dbQuery.push(eq(chatsTable.price, String(0)));
    if (type == "premium") dbQuery.push(gt(chatsTable.price, String(0)));

    const templates = await db
      .select()
      .from(chatsTable)
      .where(and(...dbQuery));

    res.status(200).json({ data: templates });
  },
);

export const getMarketplaceTemplateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Template id is required", 400);
    const [template] = await db
      .select({
        chat: chatsTable,
        category: chatCategoriesTable,
        user: {
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          avatar: usersTable.avatar,
        },
      })
      .from(chatsTable)
      .innerJoin(usersTable, eq(chatsTable.user_id, usersTable.id))
      .leftJoin(
        chatCategoriesTable,
        eq(chatsTable.category_id, chatCategoriesTable.id),
      )
      .where(and(eq(chatsTable.id, id), eq(chatsTable.public, true)));

    console.log(template);
    res.status(200).json({ data: template });
  },
);
