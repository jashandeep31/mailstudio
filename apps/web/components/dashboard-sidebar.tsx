"use client";
import { useDeleteChat } from "@/hooks/use-chats";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@repo/ui/components/sidebar";
import { Search, Mail, Radio, ShoppingBag, Hexagon, Plus } from "lucide-react";
import { MainNav } from "./dashboard-sidebar/main-nav";
import { ChatList } from "./dashboard-sidebar/chat-list";

const mainNav = [
  {
    title: "New Chat",
    url: "/dashboard",
    icon: Plus,
  },
  {
    title: "Search Templates",
    url: "/dashboard",
    icon: Search,
  },
  {
    title: "My Templates",
    url: "/dashboard/templates",
    icon: Mail,
  },
  {
    title: "Brand Kits",
    url: "/dashboard/brand-kits",
    icon: Hexagon,
  },
  // {
  //   title: "Broadcast",
  //   url: "/dashboard/broadcast",
  //   icon: Radio,
  // },
  {
    title: "Marketplace",
    url: "/dashboard/marketplace",
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
