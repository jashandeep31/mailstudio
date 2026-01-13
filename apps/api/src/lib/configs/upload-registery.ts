import { v4 as uuid } from "uuid";

export const uploadRegistry = {
  attachment: {
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    getPathKey: (fileName: string) => `attachments/${uuid()}-${fileName}`,
  },
} as const;
