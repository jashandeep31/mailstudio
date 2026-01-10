"use client";

import { useChats } from "@/hooks/use-chats";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import Link from "next/link";
import { ChatItem } from "./chat-item";

export function ChatList({
  onDeleteChat,
}: {
  onDeleteChat: (id: string) => void;
}) {
  const chatsRes = useChats();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chatsRes.data?.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton
              asChild
              className="active:bg-background data-active:bg-background"
            >
              <Link href={`/chat/${chat.id}`}>{chat.name}</Link>
            </SidebarMenuButton>
            <ChatItem chat={chat} onDelete={onDeleteChat} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
