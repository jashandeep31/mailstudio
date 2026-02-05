import { z } from "zod";

export const getChatsFilterSchema = z.object({
  lastId: z.uuid().optional(),
});
