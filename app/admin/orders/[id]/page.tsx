import { notFound } from "next/navigation";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { OrderDetailsView } from "@/domains/admin/components/orders/order-details-view";
import { getOrder } from "@/domains/catalog/repository";
import { requireAdminPage } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "تفاصيل الطلب — لوحة تحكم تغميسة" };

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminPage();
  const { id } = await params;
  const order = await getOrder(Number(id));
  if (!order) notFound();

  return (
    <AdminShell username={admin.name}>
      <OrderDetailsView order={order} />
    </AdminShell>
  );
}
