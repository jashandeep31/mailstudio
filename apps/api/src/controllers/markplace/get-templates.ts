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
  userLikedChatsTable,
  sql,
  desc,
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
      .where(and(...dbQuery))
      .orderBy(desc(chatsTable.updated_at));

    res.status(200).json({ data: templates });
  },
);

export const getMarketplaceTemplateById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!id) throw new AppError("Template id is required", 400);
    const baseQuery = db
      .select({
        chat: chatsTable,
        category: chatCategoriesTable,
        user: {
          firstName: usersTable.first_name,
          lastName: usersTable.last_name,
          avatar: usersTable.avatar,
        },
        isLiked: sql<boolean>`${userLikedChatsTable.id} IS NOT NULL`.as(
          "is_liked",
        ),
      })
      .from(chatsTable)
      .innerJoin(usersTable, eq(chatsTable.user_id, usersTable.id))
      .leftJoin(
        chatCategoriesTable,
        eq(chatsTable.category_id, chatCategoriesTable.id),
      );

    if (userId) {
      baseQuery.leftJoin(
        userLikedChatsTable,
        and(
          eq(userLikedChatsTable.chat_id, chatsTable.id),
          eq(userLikedChatsTable.user_id, userId),
        ),
      );
    } else {
      baseQuery.leftJoin(userLikedChatsTable, sql`false`);
    }
    const [template] = await baseQuery.where(eq(chatsTable.id, id));
    res.status(200).json({ data: template });
  },
);
