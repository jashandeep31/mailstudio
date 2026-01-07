import { BASE_URL } from "@/lib/contants";
import axios from "axios";

export interface UserTestMail {
  id: string;
  mail: string;
  verified: boolean;
}

export const getUserTestMails = async (): Promise<UserTestMail[]> => {
  const res = await axios.get<{ mails: UserTestMail[] }>(
    `${BASE_URL}/api/v1/user/test-mails`,
    {
      withCredentials: true,
    },
  );
  return res.data.mails;
};

export const sendTemplateOnTestMail = async (data: unknown) => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/user/test-mails/send-template`,
    data,
    {
      withCredentials: true,
    },
  );
  if (res.status !== 200)
    return {
      status: "error",
      message: "Something went wrong ",
    };
  return {
    status: "ok",
    data: null,
  };
};
