"use client";
import React from "react";
import { Moon, Sun, LogOut, Wallet, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { SettingsNav } from "@/components/settings/settings-nav";
import { PlanCard } from "@/components/settings/plan-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useUserMetadata, useUserPlan } from "@/hooks/use-user";
import { logoutUser } from "@/services/util-services";

const ClientView = () => {
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logoutUser();
  };
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
        <PlanCard planData={planRes.data} isLoading={planRes.isLoading} />

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
