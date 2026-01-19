import { BASE_URL } from "@/lib/contants";
import { brandKitsTable } from "@repo/db";
import axios from "axios";

export const getUserBrandKits = async (): Promise<
  (typeof brandKitsTable.$inferSelect)[]
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/brandkits`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getUserBrandKitById = async (
  id: string,
): Promise<typeof brandKitsTable.$inferSelect> => {
  const res = await axios.get(`${BASE_URL}/api/v1/brandkits/${id}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const updateBrandKit = async (
  data: unknown,
): Promise<typeof brandKitsTable.$inferSelect> => {
  const res = await axios.put(`${BASE_URL}/api/v1/brandkits/update`, data, {
    withCredentials: true,
  });
  return res.data.data;
};
