import { z } from "zod";

export const getMarketplaceTemplatesFilterSchema = z.object({
  categoryId: z.string().optional(),
  type: z.string().optional(),
  query: z.string().optional(),
});
