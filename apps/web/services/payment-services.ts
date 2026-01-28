import axios from "axios";
import { BASE_URL } from "@/lib/contants";
import { planTypeEnum } from "@repo/db";

export const getProSubscriptionUrl = async (data: {
  type: (typeof planTypeEnum.enumValues)[number];
}): Promise<{ url: string }> => {
  const res = await axios.post(`${BASE_URL}/api/v1/payments/upgrade`, data, {
    withCredentials: true,
  });
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
