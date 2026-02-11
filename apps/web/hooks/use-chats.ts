import { queryClient } from "@/app/provider";
import {
  deleteChat,
  getChats,
  updateChat,
  getChatById,
  likeChat,
  cloneChat,
} from "@/services/chat-services";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: () => getChats({}),
  });

export const useInfiniteChats = () =>
  useInfiniteQuery({
    queryKey: ["infinite-chats"],
    queryFn: ({ pageParam }) =>
      getChats({ lastId: pageParam ? pageParam : undefined }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.length === 11 ? lastPage.at(-1)?.id : null,
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
      queryClient.refetchQueries({ queryKey: ["infinite-chats"] });
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
      queryClient.refetchQueries({ queryKey: ["infinite-chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats", variables.chatId] });
    },
    onError: (e) => {
      toast.error("Something went wrong");
    },
  });

export const useCloneChat = () =>
  useMutation({
    mutationFn: cloneChat,
    onSuccess: () => {
      toast.success("Cloned");
      queryClient.refetchQueries({ queryKey: ["chats"] });
      queryClient.refetchQueries({ queryKey: ["infinite-chats"] });
    },
    onError: () => {
      toast.error("Failed to clone chat");
    },
  });

export const useLikeChat = () =>
  useMutation({
    mutationFn: async ({
      action,
      chatId,
    }: {
      action: "like" | "unlike";
      chatId: string;
    }) => await likeChat({ action, chatId }),
    onMutate: async ({
      action,
      chatId,
    }: {
      action: "like" | "unlike";
      chatId: string;
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["marketplace-template", chatId],
      });
      const previousData = queryClient.getQueryData([
        "marketplace-template",
        chatId,
      ]);
      queryClient.setQueryData(["marketplace-template", chatId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          chat: {
            ...old.chat,
            like_count:
              action === "like"
                ? old.chat.like_count + 1
                : Math.max(old.chat.like_count - 1, 0),
          },
          isLiked: action === "like",
        };
      });

      return { previousData, chatId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData && context?.chatId) {
        queryClient.setQueryData(
          ["marketplace-template", context.chatId],
          context.previousData,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["marketplace-template", variables.chatId],
      });
    },
  });
