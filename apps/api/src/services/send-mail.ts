import axios from "axios";
import { env } from "../lib/env.js";

interface sendMailWithResend {
  html: string;
  to: string[];
}
export const sendMailWithResend = async ({ html, to }: sendMailWithResend) => {
  const res = await axios.post(
    "https://api.resend.com/emails",
    {
      from: "Acme <onboarding@resend.dev>",
      to: to,
      subject: "hello world",
      html: html,
    },
    {
      headers: {
        Authorization: `Bearer ${env.RESEND_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
};
