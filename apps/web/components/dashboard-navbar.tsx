"use client";
import { Mail } from "lucide-react";
import React from "react";
import ProfileDropdown from "./profile-dropdown";
import Link from "next/link";

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
              Mail Studio
            </h2>
          </Link>
          <div className="flex items-center gap-6"></div>
        </div>
        <div className="flex items-center gap-3">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
