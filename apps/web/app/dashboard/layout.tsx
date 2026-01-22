import React from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

// const layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="flex h-screen flex-col">
//       <header className="bg-background sticky top-0 z-50">
//         <DashboardNavbar />
//       </header>
//       <div className="relative flex-1 overflow-auto">
//         <SidebarProvider className="h-full min-h-0">
//           <DashboardSidebar />
//           <main className="grid w-full">
//             <div className="bg-muted gid overflow-auto border-t border-l md:rounded-tl-md">
//               {children}
//             </div>
//           </main>
//         </SidebarProvider>
//       </div>
//     </div>
//   );
// };

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="h-screen">
      <header className="fixed top-0 z-50 h-14 w-full">
        <DashboardNavbar />
      </header>
      <DashboardSidebar />
      <main className="bg-muted mt-14 grid w-full overflow-auto border-t border-l md:rounded-tl-md">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
