import { queryClient } from "@/app/provider";
import { getAxiosError } from "@/lib/utils";
import {
  createBrandKit,
  deleteBrandKit,
  getUserBrandKitById,
  getUserBrandKits,
} from "@/services/brandkit-services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

export const useCreateBrandKit = () =>
  useMutation({
    mutationFn: createBrandKit,
    mutationKey: ["create-brand-kit"],
    onSuccess: () => {
      toast.success("Brand is added successfully");
      queryClient.invalidateQueries({ queryKey: ["user-brand-kits"] });
    },
    onError: (error) => {
      toast.error(getAxiosError(error));
    },
  });

export const useDeleteBrandKit = () =>
  useMutation({
    mutationFn: deleteBrandKit,
    mutationKey: ["delete-brand-kit"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-brand-kits"] });
    },
  });
