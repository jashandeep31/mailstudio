import { BASE_URL } from "@/lib/contants";
import { creditWalletsTable, plansTable } from "@repo/db";
import axios from "axios";

export const getUserMetadata = async (): Promise<
  typeof creditWalletsTable.$inferSelect
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/metadata`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getUserPlan = async (): Promise<
  typeof plansTable.$inferSelect
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/plan`, {
    withCredentials: true,
  });

  return res.data.data;
};
