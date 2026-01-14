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

export const getProSubscriptionUrl = async (): Promise<{ url: string }> => {
  const res = await axios.get(`${BASE_URL}/api/v1/payments/upgrade`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getSubsriptionManagementUrl = async (): Promise<{
  url: string;
}> => {
  const res = await axios.get(`${BASE_URL}/api/v1/payments/management`, {
    withCredentials: true,
  });
  console.log(res.data.data);
  return res.data.data;
};
