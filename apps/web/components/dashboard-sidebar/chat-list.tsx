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

export function ChatList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteChats();
  const { mutate: onDeleteChat } = useDeleteChat();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };

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
                  <span>{chat.name}</span>
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
