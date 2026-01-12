"use client";
import React from "react";
import {
  Moon,
  Sun,
  LogOut,
  CreditCard,
  Wallet,
  Settings,
  ChevronRight,
  Monitor,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { SettingsNav } from "@/components/settings/settings-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useUserPlan } from "@/hooks/use-user";

const ClientView = () => {
  const { theme, setTheme } = useTheme();

  // Static data for demonstration
  const currentUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  };

  const currentPlan = {
    type: "starter_pack",
    price: "$9.99",
    renewAt: "2024-02-15",
    features: ["1000 credits/month", "Advanced features", "Priority support"],
  };

  const credits = {
    balance: 750.5,
    monthlyLimit: 1000,
    used: 249.5,
    lastTransaction: "2024-01-10",
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  const handleManagePlan = () => {
    // TODO: Navigate to plan management
    console.log("Manage plan clicked");
  };

  const planRes = useUserPlan();
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      {/* Navigation Tabs */}
      <SettingsNav />

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div>
              <h2 className="text-base font-medium">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                {currentUser.email}
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
        {planRes.isLoading && <div></div>}
        {planRes.data && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <CreditCard className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <p className="text-muted-foreground text-xs">
                      Renews on {currentPlan.renewAt}
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={handleManagePlan} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-foreground font-medium">
                    {currentPlan.type === "starter_pack"
                      ? "Starter Pack"
                      : "Free Plan"}
                  </h4>
                  <span className="text-primary font-medium">
                    {currentPlan.price}/month
                  </span>
                </div>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
                  Last transaction: {credits.lastTransaction}
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
                    {credits.balance}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Used this month
                    </span>
                    <span className="text-foreground font-medium">
                      {credits.used}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Monthly limit</span>
                    <span className="text-foreground font-medium">
                      {credits.monthlyLimit}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="bg-border h-2 w-full rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(credits.used / credits.monthlyLimit) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {Math.round((credits.used / credits.monthlyLimit) * 100)}%
                    of monthly limit used
                  </p>
                </div>
              </div>

              {/* <Button className="w-full">Purchase More Credits</Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientView;
