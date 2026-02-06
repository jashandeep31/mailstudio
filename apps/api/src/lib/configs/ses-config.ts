import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";
import { env } from "../env.js";

export const SES_CLIENT = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SES_SECRET_KEY,
  },
});

/**
 * @deprecated only use this with full care great power comes with great responsibilty so only use using wrapper around it
 */
export const sendMail = async (params: SendEmailCommandInput) => {
  const command = new SendEmailCommand(params);
  return await SES_CLIENT.send(command);
};
