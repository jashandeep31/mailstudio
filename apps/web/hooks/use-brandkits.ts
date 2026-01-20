import { queryClient } from "@/app/provider";
import {
  createBrandKit,
  deleteBrandKit,
  getUserBrandKitById,
  getUserBrandKits,
} from "@/services/brandkit-services";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useCreateBrandKit = () => {
  return useMutation({
    mutationFn: createBrandKit,
    mutationKey: ["create-brand-kit"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-brand-kits"] });
    },
  });
};

export const useDeleteBrandKit = () => {
  return useMutation({
    mutationFn: deleteBrandKit,
    mutationKey: ["delete-brand-kit"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-brand-kits"] });
    },
  });
};
