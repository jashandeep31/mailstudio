import React from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <SidebarProvider className="h-screen">
      <header className="bg-background fixed top-0 z-50 h-14 w-full">
        <DashboardNavbar />
      </header>
      <DashboardSidebar />
      <main className="relative mt-14 flex w-full flex-col overflow-hidden border-t border-l md:rounded-tl-md">
        <div className="from-muted/50 to-muted absolute inset-0 z-0 bg-[#F5F5F5] dark:bg-[#0D0D0D]" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 flex-1 overflow-auto pb-12 backdrop-blur-[1px]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
