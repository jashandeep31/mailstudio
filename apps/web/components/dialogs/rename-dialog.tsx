"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

interface RenameDialogProps {
  children: React.ReactNode;
  currentName: string;
  onRename: (newName: string) => void | Promise<void>;
  isPending?: boolean;
}

export function RenameDialog({
  children,
  currentName,
  onRename,
  isPending: externalPending = false,
}: RenameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const isPending = externalPending;

  const handleRename = async () => {
    if (!newName.trim() || newName === currentName) return;

    try {
      await onRename(newName);
      setIsOpen(false);
      setNewName(currentName); // Reset to original name
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setNewName(currentName); // Reset when dialog closes
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chat</DialogTitle>
          <DialogDescription>Enter a new name for this chat.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="chat-name">Chat Name</Label>
            <Input
              id="chat-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter chat name"
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRename}
            disabled={isPending || !newName.trim() || newName === currentName}
          >
            {isPending ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
