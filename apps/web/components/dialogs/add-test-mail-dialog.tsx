"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

interface AddTestMailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMail: (email: string) => void;
  isCreating: boolean;
}

export function AddTestMailDialog({
  isOpen,
  onOpenChange,
  onAddMail,
  isCreating,
}: AddTestMailDialogProps) {
  const [emailValue, setEmailValue] = React.useState("");

  const resetDialog = () => {
    setEmailValue("");
    onOpenChange(false);
  };

  const handleAddMail = () => {
    onAddMail(emailValue.trim());
  };

  // Track if we started creating to know when to close
  const wasCreatingRef = React.useRef(false);

  React.useEffect(() => {
    if (isCreating) {
      wasCreatingRef.current = true;
    }
    // Close dialog only when creation finishes (was creating, now not)
    if (!isCreating && wasCreatingRef.current && isOpen) {
      wasCreatingRef.current = false;
      setEmailValue("");
      onOpenChange(false);
    }
  }, [isCreating, isOpen, onOpenChange]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a test mail</DialogTitle>
          <DialogDescription>
            Save an email address to send preview templates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="test-mail-input">Email address</Label>
          <Input
            id="test-mail-input"
            type="email"
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            placeholder="design-team@example.com"
          />
          <p className="text-muted-foreground text-xs">
            The address will appear in the list below marked as pending until
            verified.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetDialog} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMail}
            disabled={!isEmailValid || isCreating}
          >
            {isCreating ? "Adding…" : "Add mail"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
