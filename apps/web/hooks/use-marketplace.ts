import { useQuery } from "@tanstack/react-query";
import { getMarketplaceTemplates } from "../services/marketplace-services";

export const useMarketplaceTemplates = () =>
  useQuery({
    queryKey: ["marketplace-templates"],
    queryFn: getMarketplaceTemplates,
  });
