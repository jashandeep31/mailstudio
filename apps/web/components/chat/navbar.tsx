import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between pb-2">
        <Link href={"/dashboard"}>
          <h2 className="text-lg font-bold">Mail Studio</h2>
        </Link>
        <Button>Share</Button>
      </div>
    </header>
  );
};

export default Navbar;
