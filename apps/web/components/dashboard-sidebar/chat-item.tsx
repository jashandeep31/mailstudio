"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenuAction } from "@repo/ui/components/sidebar";
import { MoreHorizontal } from "lucide-react";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { RenameDialog } from "@/components/dialogs/rename-dialog";
import { useUpdateChat } from "@/hooks/use-chats";

interface ChatItemProps {
  chat: {
    id: string;
    name: string;
  };
  onDelete: (id: string) => void;
}

export function ChatItem({ chat, onDelete }: ChatItemProps) {
  const { mutate: updateChat, isPending: isUpdating } = useUpdateChat();

  const handleRename = (newName: string) => {
    updateChat({
      chatId: chat.id,
      name: newName,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg">
        <RenameDialog
          currentName={chat.name}
          onRename={handleRename}
          isPending={isUpdating}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
        </RenameDialog>

        <DropdownMenuSeparator />
        <ConfirmationDialog
          title="Delete Chat"
          description="Are you sure you want to delete this chat? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
          onConfirm={() => onDelete(chat.id)}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </ConfirmationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
