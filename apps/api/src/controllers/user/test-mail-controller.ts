import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import {
  and,
  chatVersionOutputsTable,
  db,
  eq,
  userTestMailsTable,
} from "@repo/db";
import { z } from "zod";
import { AppError } from "../../lib/app-error.js";
import { sendTemplateToTestMailSchema } from "@repo/shared";
import { sendMailWithResend } from "../../services/send-mail.js";

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

export const sendTemplateToTestMail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const parsedData = sendTemplateToTestMailSchema.parse(req.body);
    //TODO: please also verify using the user id
    const [template] = await db
      .select()
      .from(chatVersionOutputsTable)
      .where(eq(chatVersionOutputsTable.version_id, parsedData.versionId));
    const [mail] = await db
      .select()
      .from(userTestMailsTable)
      .where(
        and(
          eq(userTestMailsTable.id, parsedData.mailId),
          eq(userTestMailsTable.user_id, req.user.id),
        ),
      );

    if (!mail || !template) throw new AppError("Internal server error", 404);

    await sendMailWithResend({ html: template.html_code, to: [mail.mail] });
    res.status(200).json({
      message: "We have mailed the template",
    });
  },
);
