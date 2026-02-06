import { sendMail } from "../lib/configs/ses-config.js";
import { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { convert } from "html-to-text";

interface SendHTMLEmailParams {
  html: string;
  to: string[];
  subject: string;
  source?: string;
}
export const sendHTMLEmail = async ({
  html,
  to,
  subject,
  source = "no-reply@preview.mailstudio.dev",
}: SendHTMLEmailParams) => {
  let text = null;
  try {
    text = convert(html);
  } catch {
    text = null;
  }
  const params: SendEmailCommandInput = {
    Destination: {
      ToAddresses: [...to],
    },
    ConfigurationSetName: "my-first-configuration-set",
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
        // only if the conversion goes succces then we sending the text
        ...(text && {
          Text: {
            Charset: "UTF-8",
            Data: text,
          },
        }),
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: source,
  };
  return await sendMail(params);
};
