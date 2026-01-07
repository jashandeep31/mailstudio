import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { db, eq, userTestMailsTable } from "@repo/db";
import { z } from "zod";

export const getUserTestMails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("login is required");
    const mails = await db
      .select({
        id: userTestMailsTable.id,
        mail: userTestMailsTable.mail,
        verified: userTestMailsTable.verified,
      })
      .from(userTestMailsTable)
      .where(eq(userTestMailsTable.user_id, req.user?.id));
    res.status(200).json({ mails: mails });
    return;
  },
);

const deleteMailSchema = z.object({
  id: z.string(),
});
export const deleteUserTestMail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("Authentication failed ");
    const parsedData = deleteMailSchema.parse(req.body);
    await db
      .delete(userTestMailsTable)
      .where(eq(userTestMailsTable.id, parsedData.id));
    res.status(200).json({
      message: "Mail id is deleted",
    });
  },
);
