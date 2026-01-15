import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { SettingsNav } from "@/components/settings/settings-nav";
import PaymentsClientView from "./client-view";

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
        <PaymentsClientView />
      </div>
    </div>
  );
}
