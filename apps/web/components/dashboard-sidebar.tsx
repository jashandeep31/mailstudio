"use client";
import { useChats, useDeleteChat } from "@/hooks/use-chats";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import {
  LucideIcon,
  Search,
  Home,
  Sparkles,
  Inbox,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@repo/ui/components/dropdown-menu";
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
  const { mutate: deleteChat } = useDeleteChat();
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    // side={isMobile ? "bottom" : "right"}
                    // align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Rename</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteChat(chat.id)}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
