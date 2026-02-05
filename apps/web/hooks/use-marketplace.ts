import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  getMarketplaceTemplateById,
  getMarketplaceTemplates,
  purchaseTemplate,
} from "../services/marketplace-services";
import { z } from "zod";
import { getMarketplaceTemplatesFilterSchema } from "@repo/shared";

// infinite query for the marketplace
export const useInfiniteMarkeplaceTemplates = (
  filters: z.infer<typeof getMarketplaceTemplatesFilterSchema>,
) =>
  useInfiniteQuery({
    queryKey: ["infinite-marketplace-templates", filters],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getMarketplaceTemplates({
        ...filters,
        lastId: pageParam ? pageParam : undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.length === 6 ? lastPage.at(-1)?.id : null,
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
