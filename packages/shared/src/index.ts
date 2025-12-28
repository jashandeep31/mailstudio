import { z, ZodXID } from "zod";

export const SocketEventSchemas = {
  "event:new-chat": z.object({
    message: z.string(),
    media: z.array(z.string()),
    brandKitId: z.string().optional(),
  }),
  "event:chat-message": z.object({
    chatId: z.string(),
    message: z.string(),
    media: z.array(z.string()),
    brandKitId: z.string().optional(),
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
