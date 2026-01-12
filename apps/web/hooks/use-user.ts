import { getUserMetadata, getUserPlan } from "@/services/user-services";
import { useQuery } from "@tanstack/react-query";

export const useUserMetadata = () =>
  useQuery({
    queryKey: ["user-metadata"],
    queryFn: getUserMetadata,
  });

export const useUserPlan = () =>
  useQuery({
    queryKey: ["user-plan"],
    queryFn: getUserPlan,
  });
