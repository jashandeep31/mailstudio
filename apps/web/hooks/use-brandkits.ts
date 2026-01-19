import { getUserBrandKitById, getUserBrandKits } from "@/services/brandkit-services";
import { useQuery } from "@tanstack/react-query";

export const useUserBrandKits = () =>
  useQuery({
    queryKey: ["user-brand-kits"],
    queryFn: getUserBrandKits,
  });
export const useUserBrandKitById = (id: string) =>
  useQuery({
    queryKey: ["user-brand-kit", id],
    queryFn: () => getUserBrandKitById(id),
  });
