"use client";

import {
  MoreVertical,
  Pencil,
  Sparkles,
  Copy,
  Trash,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

interface DashboardTemplateCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  lastModified?: string;
  onRename?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const DashboardTemplateCard = ({
  id,
  name,
  thumbnail,
  lastModified,
  onRename,
  onDuplicate,
  onDelete,
}: DashboardTemplateCardProps) => {
  return (
    <div className="bg-background group w-full overflow-clip rounded-lg border transition-all hover:shadow-md">
      {/* Thumbnail Section */}
      <div className="bg-muted/20 relative aspect-3/2">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground/20 flex h-full w-full items-center justify-center">
            <div className="bg-muted h-12 w-12 rounded-full" />
          </div>
        )}

        {/* Hover Overlay with "Modify with AI" */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 font-medium shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Modify with AI
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3
              className="text-foreground truncate text-sm font-medium"
              title={name}
            >
              {name}
            </h3>
            {lastModified && (
              <p className="text-muted-foreground mt-1 text-xs">
                Edited {lastModified}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/templates/manage/${id}`}
                  className="cursor-pointer"
                >
                  <Settings className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                  Manage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename?.(id)}>
                <Pencil className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(id)}>
                <Copy className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(id)}
              >
                <Trash className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
