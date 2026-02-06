"use client";

import { LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { useRouter } from "next/navigation";

interface MainNavProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}

export function MainNav({ items }: MainNavProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNavigation = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            className="active:bg-background data-active:bg-background cursor-pointer"
            onClick={() => {
              handleNavigation(item.url);
            }}
          >
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
