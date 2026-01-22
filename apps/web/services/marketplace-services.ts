import { BASE_URL } from "@/lib/contants";
import { chatsTable } from "@repo/db";
import { getMarketplaceTemplatesFilterSchema, testSchema1 } from "@repo/shared";
import axios from "axios";

export const getMarketplaceTemplates = async (
  data: unknown,
): Promise<(typeof chatsTable.$inferSelect)[]> => {
  const parsedData = getMarketplaceTemplatesFilterSchema.parse(data);
  parsedData.categoryId;

  const test = testSchema1.parse(data);
  const res = await axios.get(`${BASE_URL}/api/v1/marketplace/templates`);
  return res.data.data;
};
