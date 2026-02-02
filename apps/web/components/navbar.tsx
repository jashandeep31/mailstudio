"use client";
import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navbarLinks: {
    label: string;
    link: string;
  }[] = [
    {
      label: "Home",
      link: "/",
    },
    { label: "Marketplace", link: "/marketplace" },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact-us" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-3">
      <div className="container">
        {/* Desktop and Mobile Header */}
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-12">
            <Link href={"/"}>
              <h2 className="text-lg font-bold">Mail Studio</h2>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-6 md:flex">
              {navbarLinks.map((navLink) => (
                <Link
                  key={navLink.link}
                  href={navLink.link}
                  className="hover:text-primary text-muted-foreground text-sm transition-colors"
                >
                  {navLink.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={"/login"}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              Login
            </Link>
            <Link
              href={"/signup"}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="hover:bg-muted rounded-md p-2 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mt-4 border-t pb-4 md:hidden">
            <nav className="flex flex-col space-y-4 pt-4">
              {/* Mobile Navigation Links */}
              {navbarLinks.map((navLink) => (
                <Link
                  key={navLink.link}
                  href={navLink.link}
                  className="hover:text-primary py-2 text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navLink.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 border-t pt-4">
                <Link
                  href={"/login"}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "w-full",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={"/signup"}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
