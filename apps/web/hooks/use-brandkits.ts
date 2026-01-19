import { getUserBrandKits } from "@/services/brandkit-services";
import { useQuery } from "@tanstack/react-query";

export const useUserBrandKits = () =>
  useQuery({
    queryKey: ["user-brand-kits"],
    queryFn: getUserBrandKits,
  });
