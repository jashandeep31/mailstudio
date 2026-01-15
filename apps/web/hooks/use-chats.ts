import { queryClient } from "@/app/provider";
import {
  deleteChat,
  getChats,
  updateChat,
  getChatById,
} from "@/services/chat-services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

export const useChat = (id: string) =>
  useQuery({
    queryKey: ["chats", id],
    queryFn: () => getChatById(id),
    enabled: !!id,
  });

export const useDeleteChat = () =>
  useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.refetchQueries({ queryKey: ["chats"] });
    },
    onError: () => {
      toast.error("eror");
    },
  });

export const useUpdateChat = () =>
  useMutation({
    mutationFn: updateChat,
    onSuccess: (_, variables) => {
      toast.success("Updated");
      queryClient.refetchQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
    },
    onError: () => {
      toast.error("eror");
    },
  });
