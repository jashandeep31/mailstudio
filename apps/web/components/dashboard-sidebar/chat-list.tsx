"use client";

import { useInfiniteChats, useDeleteChat } from "@/hooks/use-chats";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { ChatItem } from "./chat-item";
import { useRouter } from "next/navigation";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { useEffect } from "react";
import { useOngoingChatsStore } from "@/zustand-store/ongoing-chats-store";

export function ChatList() {
  const { sendEvent } = useWebSocketContext();

  const onGoingChats = useOngoingChatsStore((s) => s.chatIds);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteChats();
  const { mutate: onDeleteChat } = useDeleteChat();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };

  useEffect(() => {
    sendEvent("event:get-ongoing-chats", {});
  }, [sendEvent]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {data?.pages.flat().length === 0 ? (
          <div className="text-muted-foreground p-2 text-center text-sm">
            No chats
          </div>
        ) : (
          data?.pages.map((page) =>
            page?.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  className="active:bg-background data-active:bg-background"
                  onClick={() => handleNavigation(`/chat/${chat.id}`)}
                >
                  <span className="flex items-center gap-2">
                    {onGoingChats.has(chat.id) && (
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                      </span>
                    )}{" "}
                    {chat.name}
                  </span>
                </SidebarMenuButton>
                <ChatItem chat={chat} onDelete={onDeleteChat} />
              </SidebarMenuItem>
            )),
          )
        )}
        {hasNextPage && (
          <SidebarMenuItem className="mt-4">
            <SidebarMenuButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-muted-foreground justify-center text-xs"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
