import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProfileDropdown from "../profile-dropdown";

const Navbar = () => {
  return (
    <header className="h-14 border-b px-1 py-2">
      <div className="flex items-center justify-between px-2 pt-1 pb-2">
        <Link href={"/dashboard"}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="bg-foreground text-background rounded-md px-1 py-1">
              <Mail className="size-4" />
            </span>
            Mail Studio
          </h2>
        </Link>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
