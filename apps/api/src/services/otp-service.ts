import { v4 as uuidv4 } from "uuid";
import { db, userOtpsTable } from "@repo/db";
import { sendMailWithResend } from "./send-mail.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTPEmailHTML = (otp: string) => {
  return `
    <h1>Email Verification</h1>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>This code will expire in 15 minutes.</p>
  `;
};

export const createOTPRecord = async (
  userId: string,
  modelId: string,
  otp: string,
) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

  await db.insert(userOtpsTable).values({
    id: uuidv4(),
    user_id: userId,
    otp: otp,
    verification_key: modelId,
    used: false,
    otp_type: "MAIL_VALIDATION",
    expires_at: expiresAt,
  });

  return modelId;
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  const html = createOTPEmailHTML(otp);

  await sendMailWithResend({
    html,
    to: [email],
  });
};
