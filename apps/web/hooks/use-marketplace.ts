import { useQuery } from "@tanstack/react-query";
import {
  getMarketplaceTemplateById,
  getMarketplaceTemplates,
} from "../services/marketplace-services";
import { z } from "zod";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";
export const useMarketplaceTemplates = (
  filters: z.infer<typeof getMarketplaceTemplatesFilterSchema>,
) =>
  useQuery({
    queryKey: ["marketplace-templates", filters],
    queryFn: () => getMarketplaceTemplates(filters),
  });

export const useMarketplaceTemplateById = (id: string) =>
  useQuery({
    queryKey: ["marketplace-template", id],
    queryFn: () => getMarketplaceTemplateById(id),
  });
