import { Button } from "@repo/ui/components/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-2 pt-1 pb-2">
        <Link href={"/dashboard"}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="bg-foreground text-background rounded-md px-1 py-1">
              <Mail className="size-4" />
            </span>
            Mail Studio
          </h2>
        </Link>
        <Button>Share</Button>
      </div>
    </header>
  );
};

export default Navbar;
