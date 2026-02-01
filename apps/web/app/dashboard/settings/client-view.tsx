"use client";
import React from "react";
import { Moon, Sun, LogOut, Wallet, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@repo/ui/components/button";
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
import Link from "next/link";

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
              <p className="text-muted-foreground w-40 truncate text-sm">
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
          <CardContent className="h-full">
            <div className="h-full space-y-4">
              <div className="bg-muted/50 h-full rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Current Balance
                  </span>
                  <span className="text-primary text-2xl font-bold">
                    {userMetadata.data?.creditsWallet.balance || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-card mt-8 flex items-center justify-between rounded-md border px-4 py-4">
        <div>
          <h5 className="text-sm font-semibold">Looking for feature?</h5>
          <p className="text-muted-foreground text-xs">
            Don&apos;t Worry you can request a feature we will provider you as
            soon as possible
          </p>
        </div>
        <Link
          href={"https://mailstudio.featurebase.app"}
          className={buttonVariants({ variant: "default" })}
        >
          Request Feature
        </Link>
      </div>
    </div>
  );
};

export default ClientView;
