import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const navbarLinks: {
    label: string;
    link: string;
  }[] = [
    {
      label: "Home",
      link: "/",
    },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact-us" },
  ];
  return (
    <div className="py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href={"/"}>
            <h2 className="text-lg font-bold">Mail Studio</h2>
          </Link>
          <div className="flex items-center gap-6">
            {navbarLinks.map((navLink) => (
              <nav key={navLink.link} className="text-sm">
                <Link href={navLink.link}>{navLink.label}</Link>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={"/login"}
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
          >
            Login
          </Link>
          <Link href={"/signup"} className={cn(buttonVariants({ size: "lg" }))}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
