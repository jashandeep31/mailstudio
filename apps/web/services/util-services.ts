import { BASE_URL } from "@/lib/contants";
import { getPreSignedUrlSchema } from "@repo/shared";
import axios from "axios";
import z from "zod";

export const getPresignedUrl = async (
  data: z.infer<typeof getPreSignedUrlSchema>,
): Promise<{ key: string; url: string }> => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/utils/get-presigned-url`,
    data,
    {
      withCredentials: true,
    },
  );

  return res.data.data;
};
