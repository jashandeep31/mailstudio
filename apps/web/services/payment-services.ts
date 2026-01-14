import axios from "axios";
import { BASE_URL } from "@/lib/contants";

export const getProSubscriptionUrl = async (): Promise<{ url: string }> => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/payments/upgrade`,
    {},
    {
      withCredentials: true,
    },
  );
  return res.data.data;
};

export const getSubsriptionManagementUrl = async (): Promise<{
  url: string;
}> => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/payments/management`,
    {},
    {
      withCredentials: true,
    },
  );
  console.log(res.data.data);
  return res.data.data;
};
