import React from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-background sticky top-0 z-50">
        <DashboardNavbar />
      </header>
      <div className="relative flex-1 overflow-auto">
        <SidebarProvider className="h-full min-h-0">
          <DashboardSidebar />
          <main className="grid w-full">
            <div className="bg-muted gid overflow-auto rounded-tl-md border-t border-l">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default layout;
