import { redirect } from "next/navigation";

export default async function page() {
  redirect("/dashboard");
  // const session = getSession();
  // if (!session) redirect("/login");
  // return <ClientView />;
}
