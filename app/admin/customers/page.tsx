import { AdminShell } from "@/domains/admin/components/admin-shell";
import { CustomerList } from "@/domains/admin/components/customers/customer-list";
import { listAdminCustomers } from "@/domains/admin/repository";
import { requireAdminPage } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "العملاء — لوحة تحكم تغميسة" };

export default async function AdminCustomersPage() {
  const admin = await requireAdminPage();
  const customers = await listAdminCustomers();

  return (
    <AdminShell username={admin.name}>
      <CustomerList customers={customers} />
    </AdminShell>
  );
}
