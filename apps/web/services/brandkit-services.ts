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
): Promise<{ status: string; data: { id: string } }> => {
  const res = await axios.put(`${BASE_URL}/api/v1/brandkits/update`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const createBrandKit = async (data: unknown) => {
  const res = await axios.post(`${BASE_URL}/api/v1/brandkits`, data, {
    withCredentials: true,
  });
  return res.data.data;
};

export const createManualBrandKit = async (
  data: unknown,
): Promise<{ status: string; data: { id: string } }> => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/brandkits/create-manual`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const deleteBrandKit = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/v1/brandkits/${id}`, {
    withCredentials: true,
  });
};
