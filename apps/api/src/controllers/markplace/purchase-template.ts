import { Request, Response } from "express";
import {
  chatsTable,
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
  desc,
  creditWalletsTable,
  sql,
  creditTransactionsTable,
  and,
  gte,
  usersTable,
} from "@repo/db";
import { addToThumbnailUpdateQueue } from "../../queues/thumbnail-update-queue.js";
import { catchAsync } from "../../lib/catch-async.js";
import { z } from "zod";
import { AppError } from "../../lib/app-error.js";
import { revalidateUserCreditWalletCache } from "../../lib/redis/user-credit-wallet-cache.js";

const purchaseTemplateSchema = z.object({
  id: z.string(),
});
export const purchaseTemplate = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const userId = req.user.id;
    const parsedData = purchaseTemplateSchema.parse(req.body);

    if (1 === 1) {
      throw new AppError(
        "Please complete me i wanna reduce  the credits from the granst too ",
        400,
      );
    }
    const [template] = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, parsedData.id));

    if (!template) throw new AppError("Template not found ", 404);
    if (!template.public) throw new AppError("Template is not public", 400);

    const [sellerData] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, template.user_id));
    if (!sellerData) throw new AppError("Seller data not found ", 400);

    const chat = await db.transaction(async (tx) => {
      const [prevChatVersion] = await tx
        .select()
        .from(chatVersionsTable)
        .where(eq(chatVersionsTable.chat_id, template.id))
        .leftJoin(
          chatVersionPromptsTable,
          eq(chatVersionPromptsTable.version_id, chatVersionsTable.id),
        )
        .leftJoin(
          chatVersionOutputsTable,
          eq(chatVersionOutputsTable.version_id, chatVersionsTable.id),
        )
        .orderBy(desc(chatVersionsTable.created_at));

      if (
        !prevChatVersion ||
        !prevChatVersion.chat_version_outputs ||
        !prevChatVersion?.chat_version_prompts
      ) {
        throw new AppError("Failed to create", 500);
      }
      const [newChat] = await tx
        .insert(chatsTable)
        .values({
          name: template.name,
          public: false,
          price: template.price,
          like_count: 0,
          category_id: template.category_id,
          user_id: userId,
        })
        .returning();

      if (!newChat) throw new AppError("Failed to created", 500);
      const [newVersion] = await tx
        .insert(chatVersionsTable)
        .values({
          chat_id: newChat.id,
          user_id: userId,
          version_number: 1,
        })
        .returning();
      if (!newVersion) throw new AppError("Failed to created", 500);
      await tx.insert(chatVersionOutputsTable).values({
        overview: prevChatVersion.chat_version_outputs.overview,
        version_id: newVersion.id,
        mjml_code: prevChatVersion.chat_version_outputs.mjml_code,
        html_code: prevChatVersion.chat_version_outputs.html_code,
        generation_instructions:
          prevChatVersion.chat_version_outputs.generation_instructions,
      });
      await tx.insert(chatVersionPromptsTable).values({
        version_id: newVersion.id,
        prompt: prevChatVersion.chat_version_prompts.prompt,
      });
      // updating the user wallet
      if (Number(template.price) > 0) {
        const [updatedWallet] = await tx
          .update(creditWalletsTable)
          .set({
            balance: sql`${creditWalletsTable.balance} - ${template.price}`,
          })
          .where(
            and(
              eq(creditWalletsTable.user_id, userId),
              gte(creditWalletsTable.balance, template.price),
            ),
          )
          .returning();
        if (!updatedWallet) {
          throw new AppError("Wallet doesn't have sufficient funds", 400);
        }

        await tx.insert(creditTransactionsTable).values({
          wallet_id: updatedWallet.id,
          amount: template.price,
          after_balance: updatedWallet.balance,
          type: "spent",
          user_id: userId,
          reason: `Purchased the template ${template.name}`,
        });
        // Updating the seller wallet
        const afterFeePrice =
          Math.round(Number(template.price) * 0.75 * 100) / 100;

        const [sellerWallet] = await tx
          .update(creditWalletsTable)
          .set({
            balance: sql`${creditWalletsTable.balance} + ${afterFeePrice}`,
          })
          .where(and(eq(creditWalletsTable.user_id, sellerData.id)))
          .returning();
        if (!sellerWallet) {
          throw new AppError("Wallet doesn't have sufficient funds", 400);
        }
        await tx.insert(creditTransactionsTable).values({
          wallet_id: sellerWallet.id,
          amount: String(afterFeePrice),
          after_balance: sellerWallet.balance,
          type: "grant",

          user_id: sellerData.id,
          reason: `Profit of the template ${template.name}`,
        });
      }
      return newChat;
    });
    addToThumbnailUpdateQueue(chat.id);
    await revalidateUserCreditWalletCache(null, userId);
    res.status(200).json({
      status: "success",
      data: {
        id: chat.id,
      },
    });
  },
);
