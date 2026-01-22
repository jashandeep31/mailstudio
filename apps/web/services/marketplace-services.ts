import { BASE_URL } from "@/lib/contants";
import { chatsTable } from "@repo/db";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";
import axios from "axios";
import { z } from "zod";

/**
 * Get the template from the backend api
 */
export const getMarketplaceTemplates = async (
  data: z.infer<typeof getMarketplaceTemplatesFilterSchema>,
): Promise<(typeof chatsTable.$inferSelect)[]> => {
  const parsedData = getMarketplaceTemplatesFilterSchema.parse(data);

  const res = await axios.get(`${BASE_URL}/api/v1/marketplace/templates`, {
    params: parsedData,
  });
  return res.data.data;
};
