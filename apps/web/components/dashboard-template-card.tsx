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
import { RenameDialog } from "@/components/dialogs/rename-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { useUpdateChat } from "@/hooks/use-chats";
import Image from "next/image";

interface DashboardTemplateCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  lastModified?: string;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const DashboardTemplateCard = ({
  id,
  name,
  thumbnail,
  lastModified,
  onDuplicate,
  onDelete,
}: DashboardTemplateCardProps) => {
  const { mutate: updateChat, isPending: isUpdating } = useUpdateChat();

  const handleRename = (newName: string) => {
    updateChat({
      chatId: id,
      name: newName,
    });
  };

  return (
    <div className="bg-background group w-full overflow-clip rounded-lg border transition-all">
      {/* Thumbnail Section */}
      <div className="bg-muted/20 relative aspect-3/2">
        {thumbnail ? (
          <Image
            width={200}
            height={130}
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
            asChild
          >
            <Link href={`/chat/${id}`}>
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Modify with AI
            </Link>
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

              <RenameDialog
                currentName={name}
                onRename={handleRename}
                isPending={isUpdating}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                  Rename
                </DropdownMenuItem>
              </RenameDialog>

              <DropdownMenuItem disabled onClick={() => onDuplicate?.(id)}>
                <Copy className="text-muted-foreground mr-2 h-3.5 w-3.5" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <ConfirmationDialog
                title="Delete Template"
                description="Are you sure you want to delete this template? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={() => onDelete?.(id)}
              >
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </ConfirmationDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
