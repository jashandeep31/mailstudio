import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@repo/ui/components/sidebar";

export function DashboardSidebar() {
  return (
    <Sidebar className="border-0 group-data-[side=left]:border-0">
      <SidebarHeader />
      <SidebarContent className="bg-background">
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
