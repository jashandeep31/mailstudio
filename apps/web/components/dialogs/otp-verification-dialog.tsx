"use client";

import React from "react";
import {
  Dialog,
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

interface OtpVerificationDialogProps {
  children: React.ReactNode;
  email: string;
  mailId: string;
  onVerify: (data: { mailId: string; otp: string }) => Promise<void>;
  isVerifying?: boolean;
}

const OTP_LENGTH = 6;

export const OtpVerificationDialog = ({
  children,
  email,
  mailId,
  onVerify,
  isVerifying = false,
}: OtpVerificationDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("");

  const isDisabled = otpValue.trim().length !== OTP_LENGTH;

  const handleVerify = async () => {
    try {
      await onVerify({ mailId, otp: otpValue });
      setIsOpen(false);
      setOtpValue("");
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify email</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to <strong>{email}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            value={otpValue}
            onChange={(event) => setOtpValue(event.target.value)}
            placeholder="••••••"
          />
          <p className="text-muted-foreground text-xs">
            Didn&apos;t receive the code? Try resending it or check your spam
            folder.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isDisabled || isVerifying}>
            {isVerifying ? "Verifying…" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
