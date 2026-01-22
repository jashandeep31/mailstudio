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

export const getMarketplaceTemplateById = async (
  id: string,
): Promise<typeof chatsTable.$inferSelect> => {
  const res = await axios.get(`${BASE_URL}/api/v1/marketplace/templates/${id}`);
  return res.data.data;
};

/**
 * Purhcase the template from the marketplace new copy for the user will get created
 * @params Id send the template id
 */
export const purchaseTemplate = async (id: string): Promise<{ id: string }> => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/marketplace/purchase-template`,
    { id },
  );
  return res.data.data;
};
