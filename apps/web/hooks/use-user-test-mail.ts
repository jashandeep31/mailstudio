import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  getUserTestMails,
  sendTemplateOnTestMail,
  createUserTestMail,
  deleteUserTestMail,
  verifyUserTestMail,
  type UserTestMail,
} from "@/services/user-test-mail-services";
import { queryClient } from "@/app/provider";

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

export const useCreateUserTestMail = () => {
  return useMutation({
    mutationFn: createUserTestMail,
    onSuccess: async (data) => {
      toast.success(data.message || "Test mail added");
      await queryClient.invalidateQueries({ queryKey: ["user-test-mails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Failed to create test mail";
      toast.error(message);
    },
  });
};

export const useDeleteUserTestMail = () => {
  return useMutation({
    mutationFn: deleteUserTestMail,
    onSuccess: async (data) => {
      toast.success(data.message || "Test mail deleted");
      await queryClient.invalidateQueries({ queryKey: ["user-test-mails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Failed to delete test mail";
      toast.error(message);
    },
  });
};

export const useVerifyUserTestMail = () => {
  return useMutation({
    mutationFn: verifyUserTestMail,
    onSuccess: async (data) => {
      toast.success(data.message || "Test mail verified");
      await queryClient.invalidateQueries({ queryKey: ["user-test-mails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Failed to verify test mail";
      toast.error(message);
    },
  });
};
