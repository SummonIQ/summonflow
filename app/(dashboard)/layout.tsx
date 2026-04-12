import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ensureOrganizationContext } from "@/lib/organization";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await ensureOrganizationContext();
  if (!context) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
