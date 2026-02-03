import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMarketplaceTemplateById,
  getMarketplaceTemplates,
  purchaseTemplate,
} from "../services/marketplace-services";
import { z } from "zod";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";
export const useMarketplaceTemplates = (
  filters: z.infer<typeof getMarketplaceTemplatesFilterSchema>,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["marketplace-templates", filters],
    queryFn: () => getMarketplaceTemplates(filters),
    enabled: options?.enabled,
  });

export const useMarketplaceTemplateById = (id: string) =>
  useQuery({
    queryKey: ["marketplace-template", id],
    queryFn: () => getMarketplaceTemplateById(id),
  });

export const usePurchaseTemplate = () =>
  useMutation({
    mutationFn: (id: string) => purchaseTemplate(id),
  });
