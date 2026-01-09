"use client";
import { useChats } from "@/hooks/use-chats";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { LucideIcon, Search, Home, Sparkles, Inbox } from "lucide-react";
import Link from "next/link";
const mainNav = [
  {
    title: "Search Templates",
    url: "#",
    icon: Search,
  },
  {
    title: "My Templates",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Broadcast",
    url: "#",
    icon: Home,
  },
  {
    title: "Marketplace",
    url: "#",
    icon: Inbox,
    badge: "10",
  },
];

export function DashboardSidebar() {
  const chatsRes = useChats();
  return (
    <Sidebar className="mt-16 border-0 group-data-[side=left]:border-0">
      <SidebarHeader className="bg-background">
        <MainNav items={mainNav} />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>

          <SidebarMenu>
            {chatsRes.data?.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  className="active:bg-background data-active:bg-background bg-red-100"
                >
                  <Link href={`/chat/${chat.id}`}>{chat.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const MainNav = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className="">
          <SidebarMenuButton
            asChild
            className="active:bg-background data-active:bg-background bg-red-100"
          >
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
