import DashboardNavbar from "@/components/dashboard-navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <DashboardNavbar />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default layout;
