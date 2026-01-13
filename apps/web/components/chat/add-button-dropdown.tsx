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
import { Plus, Image, Palette, X } from "lucide-react";
import React from "react";
import Link from "next/link";

interface AddButtonDropdownProps {
  onAddPhotos?: () => void;
  onAddBrandKit?: (brand?: string) => void;
  selectedBrand?: string;
  onRemoveBrand?: () => void;
}

export default function AddButtonDropdown({
  onAddPhotos,
  onAddBrandKit,
  selectedBrand,
  onRemoveBrand,
}: AddButtonDropdownProps) {
  const handleAddPhotos = () => {
    if (onAddPhotos) {
      onAddPhotos();
    } else {
      // Default behavior if no handler provided
      console.log("Add photos clicked");
    }
  };

  const handleAddAppleBrand = () => {
    if (onAddBrandKit) {
      onAddBrandKit("Apple");
    } else {
      console.log("Apple brand kit clicked");
    }
  };

  const handleAddSamsungBrand = () => {
    if (onAddBrandKit) {
      onAddBrandKit("Samsung");
    } else {
      console.log("Samsung brand kit clicked");
    }
  };

  const handleAddGoogleBrand = () => {
    if (onAddBrandKit) {
      onAddBrandKit("Google");
    } else {
      console.log("Google brand kit clicked");
    }
  };

  const handleAddMicrosoftBrand = () => {
    if (onAddBrandKit) {
      onAddBrandKit("Microsoft");
    } else {
      console.log("Microsoft brand kit clicked");
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
            <Image className="mr-2 h-4 w-4" />
            Add photos
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              Select brandkit
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={handleAddAppleBrand}>
                Apple
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddSamsungBrand}>
                Samsung
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddGoogleBrand}>
                Google
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddMicrosoftBrand}>
                Microsoft
              </DropdownMenuItem>
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
          <span>{selectedBrand} </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={onRemoveBrand}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
