import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import {
  and,
  chatVersionOutputsTable,
  chatVersionsTable,
  db,
  desc,
  eq,
  userOtpsTable,
  userTestMailsTable,
} from "@repo/db";
import { z } from "zod";
import { AppError } from "../../lib/app-error.js";
import { sendTemplateToTestMailSchema } from "@repo/shared";
import { sendMailWithResend } from "../../services/send-mail.js";
import { v4 as uuidv4 } from "uuid";
import {
  generateOTP,
  createOTPRecord,
  sendVerificationEmail,
  verifyOTP,
} from "../../services/otp-service.js";

const deleteTestMailSchema = z.object({
  id: z.string(),
});

const createTestMailSchema = z.object({
  email: z.email("Invalid email format"),
});

const verifyTestMailSchema = z.object({
  mailId: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

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

export const deleteTestMail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("Authentication failed ");
    const parsedData = deleteTestMailSchema.parse(req.params);
    await db
      .delete(userTestMailsTable)
      .where(
        and(
          eq(userTestMailsTable.id, parsedData.id),
          eq(userTestMailsTable.user_id, req.user.id),
        ),
      );
    res.status(200).json({
      message: "Mail id is deleted",
    });
  },
);

export const verifyTestMail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const parsedData = verifyTestMailSchema.parse(req.body);

    const [mail] = await db
      .select()
      .from(userTestMailsTable)
      .where(
        and(
          eq(userTestMailsTable.id, parsedData.mailId),
          eq(userTestMailsTable.user_id, req.user.id),
        ),
      );

    if (!mail) {
      throw new AppError("Test mail not found", 404);
    }

    if (mail.verified) {
      res.status(200).json({
        message: "Test mail already verified",
      });
      return;
    }

    const [otpRecord] = await db
      .select()
      .from(userOtpsTable)
      .where(
        and(
          eq(userOtpsTable.verification_key, parsedData.mailId),
          eq(userOtpsTable.user_id, req.user.id),
          eq(userOtpsTable.otp_type, "MAIL_VALIDATION"),
        ),
      )
      .orderBy(desc(userOtpsTable.created_at));

    if (!otpRecord) {
      throw new AppError("Verification code not found", 400);
    }

    if (otpRecord.used) {
      throw new AppError("Verification code already used", 400);
    }

    if (otpRecord.expires_at < new Date()) {
      throw new AppError("Verification code expired", 400);
    }

    const isValid = verifyOTP(parsedData.otp, otpRecord.otp);

    if (!isValid) {
      throw new AppError("Invalid verification code", 400);
    }

    await db.transaction(async (tx) => {
      await tx
        .update(userOtpsTable)
        .set({
          used: true,
          used_at: new Date(),
        })
        .where(eq(userOtpsTable.id, otpRecord.id));

      await tx
        .update(userTestMailsTable)
        .set({
          verified: true,
          updated_at: new Date(),
        })
        .where(eq(userTestMailsTable.id, parsedData.mailId));
    });

    res.status(200).json({
      message: "Test mail verified successfully",
    });
  },
);

export const createTestMail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const parsedData = createTestMailSchema.parse(req.body);

    // Check if email already exists for this user
    const existingMail = await db
      .select()
      .from(userTestMailsTable)
      .where(
        and(
          eq(userTestMailsTable.user_id, req.user.id),
          eq(userTestMailsTable.mail, parsedData.email),
        ),
      );

    if (existingMail.length > 0) {
      throw new AppError("Email already exists", 409);
    }

    // Generate OTP
    const otp = generateOTP();

    // Create new test mail
    const [newMail] = await db
      .insert(userTestMailsTable)
      .values({
        id: uuidv4(),
        user_id: req.user.id,
        mail: parsedData.email,
        verified: false,
      })
      .returning();

    if (!newMail) {
      throw new AppError("Failed to create test mail", 500);
    }

    // Create OTP record with email ID in verification key
    await createOTPRecord(req.user.id, newMail.id, otp);

    // Send OTP email
    await sendVerificationEmail(parsedData.email, otp);

    res.status(201).json({
      message:
        "Test mail created successfully. Please check your email for verification code.",
      mail: newMail,
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
      .innerJoin(
        chatVersionsTable,
        eq(chatVersionOutputsTable.version_id, chatVersionsTable.id),
      )
      .where(
        and(
          eq(chatVersionOutputsTable.version_id, parsedData.versionId),
          eq(chatVersionsTable.user_id, req.user.id),
        ),
      );
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

    await sendMailWithResend({
      html: template.chat_version_outputs.html_code,
      to: [mail.mail],
    });
    res.status(200).json({
      message: "Test mail sent successfully",
    });
  },
);
