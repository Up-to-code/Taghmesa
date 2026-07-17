import { requireAdminPage } from "@/lib/auth/server";
import { getAdminOverview } from "@/domains/admin/repository";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { AdminOverview } from "@/domains/admin/components/admin-overview";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة التحكم — تغميسة" };

export default async function AdminPage() {
  const admin = await requireAdminPage();
  const overview = await getAdminOverview();
  return <AdminShell username={admin.name}><AdminOverview overview={overview}/></AdminShell>;
}
