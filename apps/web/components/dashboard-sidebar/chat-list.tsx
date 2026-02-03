"use client";

import { useChats, useDeleteChat } from "@/hooks/use-chats";
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
  const chatsRes = useChats();
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
        {chatsRes.data?.length === 0 ? (
          <div className="text-muted-foreground p-2 text-center text-sm">
            No chats
          </div>
        ) : (
          chatsRes.data?.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                className="active:bg-background data-active:bg-background"
                onClick={() => handleNavigation(`/chat/${chat.id}`)}
              >
                <span>{chat.name}</span>
              </SidebarMenuButton>
              <ChatItem chat={chat} onDelete={onDeleteChat} />
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
