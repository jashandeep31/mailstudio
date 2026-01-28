"use client";
import React, { useCallback } from "react";
import { CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  getProSubscriptionUrl,
  getSubsriptionManagementUrl,
} from "@/services/payment-services";

interface PlanCardProps {
  planData?: {
    plan_type: "free" | "pro" | "pro_plus";
    renew_at: Date;
    price: string;
  };
  isLoading?: boolean;
}

export const PlanCard = ({ planData, isLoading }: PlanCardProps) => {
  const handlePlanUpgrade = useCallback(async (type: "pro" | "pro_plus") => {
    const res = await getProSubscriptionUrl({ type });
    window.location.href = res.url;
  }, []);

  const handleSubscriptionManagement = useCallback(async () => {
    const res = await getSubsriptionManagementUrl();
    window.location.href = res.url;
  }, []);

  const getPlanName = (planType: "free" | "pro" | "pro_plus") => {
    switch (planType) {
      case "free":
        return "Free Plan";
      case "pro":
        return "Pro Plan";
      case "pro_plus":
        return "Pro Plus Plan";
    }
  };

  const getPlanPrice = (planType: "free" | "pro" | "pro_plus") => {
    switch (planType) {
      case "free":
        return "$0";
      case "pro":
        return "$10";
      case "pro_plus":
        return "$30";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planData) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <CreditCard className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">
                {getPlanName(planData.plan_type)}
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Renewal date: {new Date(planData.renew_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {planData.plan_type === "free" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => handlePlanUpgrade("pro")}
              >
                Get Pro
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => handlePlanUpgrade("pro_plus")}
              >
                Get Pro+
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSubscriptionManagement}
            >
              Manage Plan
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-foreground text-sm font-medium">
              {getPlanName(planData.plan_type)}
            </h4>
            <span className="text-primary text-lg font-semibold">
              {getPlanPrice(planData.plan_type)}
              <span className="text-muted-foreground text-xs font-normal">
                /month
              </span>
            </span>
          </div>
          {planData.plan_type === "pro" && (
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Get 10 credits each month</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Create or buy templates</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Create up to 5 brand kits</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>500 test mails to your own email ids</span>
              </li>
            </ul>
          )}
          {planData.plan_type === "pro_plus" && (
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Get 30 credits each month</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Create or buy templates</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Create unlimited brand kits</span>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span>Unlimited test mails to your own email ids</span>
              </li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
