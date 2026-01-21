import { BASE_URL } from "@/lib/contants";
import { chatsTable } from "@repo/db";
import axios from "axios";

export const getMarketplaceTemplates = async (): Promise<
  (typeof chatsTable.$inferSelect)[]
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/marketplace/templates`);
  return res.data.data;
};
