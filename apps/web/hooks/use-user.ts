import {
  getUserBillings,
  getUserCreditsHistory,
  getUserMetadata,
  getUserPayments,
  getUserPlan,
} from "@/services/user-services";
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

export const useUserBillings = () =>
  useQuery({
    queryKey: ["user-billings"],
    queryFn: getUserBillings,
  });

export const useUserPayments = () =>
  useQuery({
    queryKey: ["user-payments"],
    queryFn: getUserPayments,
  });

export const useUserCreditsHistory = () =>
  useQuery({
    queryKey: ["user-credits-history"],

    queryFn: getUserCreditsHistory,
  });
