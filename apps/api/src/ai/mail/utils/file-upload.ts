import axios from "axios";
import path from "path";
import { File } from "@google/genai";
import { googleGenAi } from "../../config.js";

const FILE_PROCESSING_POLL_INTERVAL_MS = 5000;

export interface UploadedFile {
  uri: string;
  mimeType: string;
}

export const uploadMediaFiles = async (
  mediaUrls: string[],
): Promise<File[]> => {
  const uploadPromises = mediaUrls.map(uploadSingleFile);
  return Promise.all(uploadPromises);
};

const uploadSingleFile = async (mediaUrl: string): Promise<File> => {
  const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });

  const buffer = Buffer.from(response.data);
  const mimeType = response.headers["content-type"] || "image/png";
  const blob = new Blob([buffer], { type: mimeType });
  const fileName = path.basename(new URL(mediaUrl).pathname) || "media-file";

  return googleGenAi.files.upload({
    file: blob,
    config: { displayName: fileName, mimeType },
  });
};

export const waitForFilesProcessing = async (files: File[]): Promise<void> => {
  await Promise.all(files.map(waitForSingleFileProcessing));
};

const waitForSingleFileProcessing = async (file: File): Promise<void> => {
  let fileStatus = await googleGenAi.files.get({ name: file.name as string });

  while (fileStatus.state === "PROCESSING") {
    await delay(FILE_PROCESSING_POLL_INTERVAL_MS);
    fileStatus = await googleGenAi.files.get({ name: file.name as string });
  }
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getValidFiles = (files: File[]): UploadedFile[] =>
  files
    .filter((file): file is File & { uri: string; mimeType: string } =>
      Boolean(file.uri && file.mimeType),
    )
    .map(({ uri, mimeType }) => ({ uri, mimeType }));
