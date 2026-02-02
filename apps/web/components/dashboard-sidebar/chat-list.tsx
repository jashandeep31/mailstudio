"use client";

import { useChats, useDeleteChat } from "@/hooks/use-chats";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import Link from "next/link";
import { ChatItem } from "./chat-item";

export function ChatList() {
  const chatsRes = useChats();
  const { mutate: onDeleteChat } = useDeleteChat();
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
                asChild
                className="active:bg-background data-active:bg-background"
              >
                <Link href={`/chat/${chat.id}`}>{chat.name}</Link>
              </SidebarMenuButton>
              <ChatItem chat={chat} onDelete={onDeleteChat} />
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
