import { useQuery } from "@tanstack/react-query";
import { getUserTestMails } from "@/services/user-test-mail-services";

export const useUserTestMails = () =>
  useQuery({
    queryKey: ["user-test-mails"],
    queryFn: getUserTestMails,
  });
