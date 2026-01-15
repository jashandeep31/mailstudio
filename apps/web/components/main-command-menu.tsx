"use client";
import React from "react";
import {
  Command,
  CommandInput,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { useRouter } from "next/navigation";
const MainCommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commandsList: { label: string; href: string }[] = [
    { label: "New Chat", href: "/dashboard" },
    { label: "My Templates", href: "/dashboard/templates" },
    { label: "Marketplace", href: "/dashboard/marketplace" },
    { label: "Brand Kits", href: "/dashboard/brand-kits" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="min-w-[500px]">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {commandsList.map((command) => (
              <CommandItem
                className="p-1 text-sm"
                key={command.label}
                onSelect={() => {
                  router.push(command.href);
                  setOpen(false);
                }}
              >
                {command.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default MainCommandMenu;
