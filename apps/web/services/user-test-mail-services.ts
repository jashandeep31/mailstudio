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
  const res = await axios.post<{ message: string }>(
    `${BASE_URL}/api/v1/user/test-mails/send-template`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const createUserTestMail = async (data: unknown) => {
  const res = await axios.post<{ message: string; mail: UserTestMail }>(
    `${BASE_URL}/api/v1/user/test-mails`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const deleteUserTestMail = async (id: string) => {
  const res = await axios.delete<{ message: string }>(
    `${BASE_URL}/api/v1/user/test-mails/${id}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const verifyUserTestMail = async (data: {
  mailId: string;
  otp: string;
}) => {
  const res = await axios.post<{ message: string }>(
    `${BASE_URL}/api/v1/user/test-mails/verify`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};
