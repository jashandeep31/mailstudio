"use client";
import React from "react";
import { Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

interface CreditsCardProps {
  creditsWallet?: {
    balance: string;
    updated_at: Date | null;
  };
}

export const CreditsCard = ({ creditsWallet }: CreditsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Wallet className="text-primary h-4 w-4" />
          </div>
          <div>
            <CardTitle>Credits</CardTitle>
            <p className="text-muted-foreground text-xs">
              Last updated:{" "}
              {creditsWallet?.updated_at
                ? new Date(creditsWallet.updated_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-full space-y-4">
          <div className="bg-muted/50 h-full rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-foreground font-medium">
                Current Balance
              </span>
              <span className="text-primary text-2xl font-bold">
                {creditsWallet?.balance || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
