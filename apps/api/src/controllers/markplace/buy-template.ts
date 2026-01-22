import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { never, z } from "zod";
import { AppError } from "../../lib/app-error.js";
import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";
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
} from "@repo/db";

const buyTemplateSchema = z.object({
  id: z.string(),
});
export const buyTemplate = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication is required", 400);
  const parsedData = buyTemplateSchema.parse(req.body);
  const wallet = await getCachedUserCreditWallet(req.user.id);

  const [template] = await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.id, parsedData.id));

  if (!template) throw new AppError("Template not found ", 404);
  if (!template.public) throw new AppError("Template is not public", 400);
  if (!wallet) {
    throw new AppError("Wallet not found", 400);
  }

  const chat = await db.transaction(async (tx) => {
    if (!req.user) throw new AppError("Authentication is required", 400);

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
        ...template,
        user_id: req.user.id,
      })
      .returning();

    if (!newChat) throw new AppError("Failed to created", 500);
    const [newVersion] = await tx
      .insert(chatVersionsTable)
      .values({
        ...prevChatVersion.chat_versions,
        chat_id: newChat.id,
        user_id: req.user.id,
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

    const [updatedWallet] = await tx
      .update(creditWalletsTable)
      .set({
        balance: sql`${creditWalletsTable.balance} - ${template.price}`,
      })
      .where(
        and(
          eq(creditWalletsTable.user_id, req.user.id),
          gte(creditWalletsTable.balance, template.price),
        ),
      )
      .returning();
    if (!updatedWallet) {
      throw new AppError("Wallet doesn't have sufficient funds", 400);
    }

    await tx.insert(creditTransactionsTable).values({
      wallet_id: wallet.id,
      amount: template.price,
      after_balance: updatedWallet.balance,
      type: "spent",
      user_id: req.user.id,
      reason: `Purchased the template ${template.name}`,
    });
    return newChat;
  });
  res.status(200).json({
    status: "success",
    data: {
      id: chat.id,
      redirect_url: `/chat/${chat.id}`,
    },
  });
});
