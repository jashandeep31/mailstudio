import { queryClient } from "@/app/provider";
import { deleteChat, getChats } from "@/services/chat-services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
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
