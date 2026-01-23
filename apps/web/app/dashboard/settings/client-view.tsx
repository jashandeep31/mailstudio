"use client";
import React, { useCallback } from "react";
import {
  Moon,
  Sun,
  LogOut,
  CreditCard,
  Wallet,
  Settings,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { SettingsNav } from "@/components/settings/settings-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useUserMetadata, useUserPlan } from "@/hooks/use-user";
import {
  getProSubscriptionUrl,
  getSubsriptionManagementUrl,
} from "@/services/payment-services";
import { logoutUser } from "@/services/util-services";

const ClientView = () => {
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logoutUser();
  };
  const handlePlanUpgrade = useCallback(async () => {
    const res = await getProSubscriptionUrl();
    window.location.href = res.url;
  }, []);

  const handleSubscriptionManagement = useCallback(async () => {
    const res = await getSubsriptionManagementUrl();
    window.location.href = res.url;
  }, []);
  const planRes = useUserPlan();
  const userMetadata = useUserMetadata();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      {/* Navigation Tabs */}
      <SettingsNav />

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold">
              {userMetadata.data?.user.firstName[0]}
              {userMetadata.data?.user.lastName[0]}
            </div>
            <div>
              <h2 className="text-base font-medium">
                {userMetadata.data?.user.firstName}{" "}
                {userMetadata.data?.user.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                {userMetadata.data?.user.email}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Theme Section - Independent */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-lg">
              {theme === "light" ? (
                <Sun className="text-foreground h-4 w-4" />
              ) : theme === "dark" ? (
                <Moon className="text-foreground h-4 w-4" />
              ) : (
                <Monitor className="text-foreground h-4 w-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">Theme</h3>
              <p className="text-muted-foreground text-xs">
                Choose your preferred theme
              </p>
            </div>
          </div>
          <Select
            value={theme}
            onValueChange={(value: "system" | "light" | "dark") =>
              setTheme(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Plan Section - Card */}
        {planRes.isLoading && (
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
        )}
        {planRes.data && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <CreditCard className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {planRes.data.plan_type
                        .toUpperCase()
                        .split("_")
                        .join(" ")}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">
                      Renewal date:{" "}
                      {new Date(planRes.data.renew_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {planRes.data.plan_type == "free" ? (
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handlePlanUpgrade}
                  >
                    <Settings className="h-4 w-4" />
                    Upgrade plan
                  </Button>
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
                    {planRes.data.plan_type === "starter_pack"
                      ? "Starter Pack"
                      : "Free Plan"}
                  </h4>
                  <span className="text-primary text-lg font-semibold">
                    ${planRes.data.price}
                    <span className="text-muted-foreground text-xs font-normal">
                      /month
                    </span>
                  </span>
                </div>
                {planRes.data.plan_type === "starter_pack" && (
                  <ul className="text-muted-foreground space-y-2 text-xs">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span>Get 10 credits each month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span>Create or buy templates.</span>
                    </li>

                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span>Create up to 5 brand kits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span>500 test mails to your own email ids.</span>
                    </li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credits Section - Card */}
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
                  {userMetadata.data?.creditsWallet.updated_at
                    ? new Date(
                        userMetadata.data.creditsWallet.updated_at,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Current Balance
                  </span>
                  <span className="text-primary text-2xl font-bold">
                    {userMetadata.data?.creditsWallet.balance || "0.00"}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground p-2 text-xs">
                Currently, we don&apos;t officially support carrying over
                credits from previous months. However, for now, we are allowing
                unused credits to roll over to the next month. Please note that
                this is a temporary policy, and we will update you soon on
                whether this feature will continue or not.
              </p>

              {/* <Button className="w-full">Purchase More Credits</Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientView;
