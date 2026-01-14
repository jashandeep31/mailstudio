import { ContentListUnion, createPartFromUri } from "@google/genai";
import { UploadedFile } from "./file-upload.js";

export const buildContent = (
  textContent: string,
  files: UploadedFile[],
): ContentListUnion => {
  const content: ContentListUnion = [textContent];

  for (const { uri, mimeType } of files) {
    content.push(createPartFromUri(uri, mimeType));
  }

  return content;
};
