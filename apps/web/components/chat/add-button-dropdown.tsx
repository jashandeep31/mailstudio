"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Plus, Image as IconImage, Palette, X, ImageIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserBrandKits } from "@/hooks/use-brandkits";

interface AddButtonDropdownProps {
  onAddPhotos?: () => void;
  selectedBrand: {
    name: string;
    id: string;
  } | null;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<{ name: string; id: string } | null>
  >;
}

export default function AddButtonDropdown({
  onAddPhotos,
  selectedBrand,
  setSelectedBrand,
}: AddButtonDropdownProps) {
  const brandkits = useUserBrandKits();
  const handleAddPhotos = () => {
    if (onAddPhotos) {
      onAddPhotos();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-max">
          <DropdownMenuItem onClick={handleAddPhotos}>
            <IconImage className="mr-2 h-4 w-4" />
            Add photos
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              Select brandkit
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {brandkits.data?.map((brandkit) => (
                <DropdownMenuItem
                  onClick={() =>
                    setSelectedBrand({ name: brandkit.name, id: brandkit.id })
                  }
                  key={brandkit.id}
                >
                  {brandkit.logo_url ? (
                    <Image
                      alt="brand"
                      width={30}
                      height={30}
                      className="h-auto w-4"
                      src={brandkit.logo_url}
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  {brandkit.name}
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem asChild>
                <Link href="/dashboard/brand-kits" className="text-blue-600">
                  Manage brand kits
                </Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedBrand && (
        <div className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2 py-1 text-sm">
          <span>{selectedBrand.name} </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => {
              setSelectedBrand(null);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
