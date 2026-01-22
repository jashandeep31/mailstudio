import { z } from "zod";

export const SocketEventSchemas = {
  "event:new-chat": z.object({
    message: z.string().min(10),
    media: z.array(z.string()),
    brandKitId: z.string().optional(),
  }),
  "event:first-chat-message": z.object({
    chatId: z.string(),
    message: z.string(),
    media: z.array(z.string()),
    brandKitId: z.string().optional(),
  }),
  "event:joined-chat": z.object({
    chatId: z.string(),
  }),
  "event:left-chat": z.object({
    chatId: z.string(),
  }),
  "event:refine-template-message": z.object({
    chatId: z.string(),
    message: z.string().min(10),
    media: z.array(z.string()),
    brandKitId: z.string().optional(),
    prevVersionId: z.string(),
  }),
} as const;

export const SocketEventKeySchema = z.enum(
  Object.keys(SocketEventSchemas) as [
    keyof typeof SocketEventSchemas,
    ...(keyof typeof SocketEventSchemas)[],
  ],
);

export type SocketEventKey = keyof typeof SocketEventSchemas;

export type SocketEventPayload<K extends SocketEventKey> = z.infer<
  (typeof SocketEventSchemas)[K]
>;

export const sendTemplateToTestMailSchema = z.object({
  versionId: z.string(),
  mailId: z.string(),
});

export const getPreSignedUrlSchema = z.object({
  key: z.enum(["attachment"]),
  contentType: z.string(),
  fileName: z.string(),
  size: z.number(),
});

export const testSchema1 = z.object({
  name: z.string().optional(),
});
