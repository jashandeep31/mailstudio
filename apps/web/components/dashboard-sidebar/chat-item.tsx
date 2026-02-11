"use client";

import { Pencil, PencilLine, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenuAction, useSidebar } from "@repo/ui/components/sidebar";
import { MoreHorizontal } from "lucide-react";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { RenameDialog } from "@/components/dialogs/rename-dialog";
import { useCloneChat, useUpdateChat } from "@/hooks/use-chats";
import { useRouter } from "next/navigation";

interface ChatItemProps {
  chat: {
    id: string;
    name: string;
  };
  onDelete: (id: string) => void;
}

export function ChatItem({ chat, onDelete }: ChatItemProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate: updateChat, isPending: isUpdating } = useUpdateChat();
  const { mutateAsync: cloneChat, isPending: isCloning } = useCloneChat();

  const handleRename = (newName: string) => {
    updateChat({
      chatId: chat.id,
      name: newName,
    });
  };

  const handleClone = async () => {
    const clonedChat = await cloneChat({ chatId: chat.id });
    router.push(`/chat/${clonedChat.id}`);
    setOpenMobile(false);
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
            <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
        </RenameDialog>

        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/templates/manage/${chat.id}`);
            setOpenMobile(false);
          }}
        >
          <PencilLine className="text-muted-foreground mr-2 h-4 w-4" />
          <span>Manage</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isCloning}
          onClick={() => {
            void handleClone();
          }}
        >
          <Copy className="text-muted-foreground mr-2 h-4 w-4" />
          <span>{isCloning ? "Cloning..." : "Clone"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <ConfirmationDialog
          title="Delete Chat"
          description="Are you sure you want to delete this chat? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
          onConfirm={() => onDelete(chat.id)}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </ConfirmationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
