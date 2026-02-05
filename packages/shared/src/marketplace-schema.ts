import { z } from "zod";

export const getMarketplaceTemplatesFilterSchema = z.object({
  categoryId: z.uuid().optional(),
  type: z.string().optional(),
  query: z.string().optional(),
  lastId: z.uuid().optional(),
  limit: z.number().optional(),
});
