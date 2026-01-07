import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getUserTestMails,
  sendTemplateOnTestMail,
  type UserTestMail,
} from "@/services/user-test-mail-services";

export type { UserTestMail };

export interface ApiError {
  message: string;
  statusCode?: number;
}

export const useUserTestMails = ({ enabled }: { enabled: boolean }) =>
  useQuery<UserTestMail[], AxiosError<ApiError>>({
    queryKey: ["user-test-mails"],
    queryFn: getUserTestMails,
    retry: (failureCount, error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: enabled,
  });

export const useSendTemplateOnTestMail = () =>
  useMutation({
    mutationFn: sendTemplateOnTestMail,
  });
