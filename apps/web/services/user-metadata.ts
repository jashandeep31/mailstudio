import { BASE_URL } from "@/lib/contants";
import axios from "axios";

export const getUserMetadata = async (): Promise<{
  balance: string;
}> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/metadata`, {
    withCredentials: true,
  });
  return res.data.data;
};
