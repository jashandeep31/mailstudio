import { Button } from "@repo/ui/components/button";
import React from "react";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold">Mail Studio</h2>
        <Button>Share</Button>
      </div>
    </header>
  );
};

export default Navbar;
