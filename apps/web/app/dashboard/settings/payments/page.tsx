import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { SettingsNav } from "@/components/settings/settings-nav";

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      {/* Navigation Tabs */}
      <SettingsNav />

      <div className="mt-8">
        <h2 className="text-2xl font-medium">Payments</h2>
        <p className="text-muted-foreground mt-2">
          Hello World - Payments Page
        </p>
      </div>
    </div>
  );
}
