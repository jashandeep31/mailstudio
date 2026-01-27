import { Job, Queue, Worker } from "bullmq";
import { env } from "../lib/env.js";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { r2RemoveObject, uploadObjectToR2 } from "../lib/configs/r2-config.js";
import { chatsTable, db, eq } from "@repo/db";

const templateUpdateQueue = new Queue("thumbnail-update", {
  connection: { url: env.REDIS_URL },
});

export async function addToThumbnailUpdateQueue(chatId: string) {
  await templateUpdateQueue.add("thumbnail-update", {
    url: `${env.BACKEND_URL}/api/v1/internal/get-html-code/${chatId}`,
    id: chatId,
  });
}

new Worker(
  "thumbnail-update",
  async (job: Job<{ url: string; id: string }>) => {
    console.log(job.data.url);
    const response = await axios.post(
      `${env.SCREENSHOT_SERVICE_URL}/screenshot`,
      {
        url: job.data.url,
      },
      { responseType: "arraybuffer" },
    );
    const buffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"] || "image/png";
    const fileKey = `chat-thumbnails/${uuid()}.png`;
    uploadObjectToR2({
      uniqueKey: fileKey,
      contentType: mimeType,
      body: buffer,
    });
    const publicUrl = `${env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileKey}`;

    // Freeing up the space
    const [chat] = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.id, job.data.id));
    if (!chat) return;
    if (chat.thumbnail) {
      await r2RemoveObject(chat.thumbnail);
    }

    // Updating the thumbnail url
    await db
      .update(chatsTable)
      .set({
        thumbnail: publicUrl,
      })
      .where(eq(chatsTable.id, job.data.id));
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
    concurrency: 1,
  },
);
