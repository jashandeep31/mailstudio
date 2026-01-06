import { BASE_URL } from "@/lib/contants";
import axios from "axios";

export const getUserTestMails = async (): Promise<
  { mail: string; id: string; verified: boolean }[]
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/test-mails`, {
    withCredentials: true,
  });
  return res.data.mails;
};
