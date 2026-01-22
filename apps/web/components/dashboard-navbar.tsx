"use client";
import { Mail } from "lucide-react";
import React from "react";
import ProfileDropdown from "./profile-dropdown";
import Link from "next/link";
import { SidebarTrigger } from "@repo/ui/components/sidebar";

const DashboardNavbar = () => {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href={"/dashboard"}>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <span className="bg-foreground text-background rounded-md px-1 py-1">
                <Mail className="size-4" />
              </span>
              <span className="hidden md:inline-block">Mail Studio</span>
            </h2>
          </Link>
          <div className="flex items-center gap-6"></div>
        </div>
        <div className="flex items-center gap-3">
          <ProfileDropdown />
          <div className="block md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
