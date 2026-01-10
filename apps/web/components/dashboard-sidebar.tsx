"use client";
import { useDeleteChat } from "@/hooks/use-chats";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@repo/ui/components/sidebar";
import { Search, Mail, Radio, ShoppingBag } from "lucide-react";
import { MainNav } from "./dashboard-sidebar/main-nav";
import { ChatList } from "./dashboard-sidebar/chat-list";

const mainNav = [
  {
    title: "Search Templates",
    url: "#",
    icon: Search,
  },
  {
    title: "My Templates",
    url: "#",
    icon: Mail,
  },
  {
    title: "Brand Kits",
    url: "#",
    icon: Mail,
  },
  {
    title: "Broadcast",
    url: "#",
    icon: Radio,
  },
  {
    title: "Marketplace",
    url: "#",
    icon: ShoppingBag,
    badge: "10",
  },
];

export function DashboardSidebar() {
  const { mutate: deleteChat } = useDeleteChat();

  return (
    <Sidebar className="mt-16 border-0 group-data-[side=left]:border-0">
      <SidebarHeader className="bg-background">
        <MainNav items={mainNav} />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <ChatList onDeleteChat={deleteChat} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
