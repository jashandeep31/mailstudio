import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "../env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2Client = new S3Client({
  region: env.CLOUDFLARE_R2_REGION,
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

/**
 * @deprecated this for the internal buffer
 */
export const uploadObjectToR2 = async ({
  uniqueKey,
  body,
  contentType,
}: {
  uniqueKey: string;
  body: NonNullable<PutObjectCommandInput["Body"]>;
  contentType: string;
}) => {
  const command = new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: contentType,
    Body: body,
  });
  return await r2Client.send(command);
};

export const r2GetSignedUrl = async ({
  uniqueKey,
  contentType,
}: {
  uniqueKey: string;
  contentType: string;
}) => {
  const command = new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: contentType,
  });
  return await getSignedUrl(r2Client, command, { expiresIn: 60 });
};
