import { notFound } from "next/navigation";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { CustomerDetails } from "@/domains/admin/components/customers/customer-details";
import { getAdminCustomer } from "@/domains/admin/repository";
import { requireAdminPage } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "تفاصيل العميل — لوحة تحكم تغميسة" };

export default async function AdminCustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminPage();
  const { id } = await params;
  const customer = await getAdminCustomer(id);
  if (!customer) notFound();

  return (
    <AdminShell username={admin.name}>
      <CustomerDetails customer={customer} />
    </AdminShell>
  );
}
