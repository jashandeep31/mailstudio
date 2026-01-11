import { getUserMetadata } from "@/services/user-metadata";
import { useQuery } from "@tanstack/react-query";

export const useUserMetadata = () =>
  useQuery({
    queryKey: ["user-metadata"],
    queryFn: getUserMetadata,
  });
