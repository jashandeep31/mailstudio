import { getChats } from "@/services/chat-services";
import { useQuery } from "@tanstack/react-query";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });
