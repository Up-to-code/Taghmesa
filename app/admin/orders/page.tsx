import { requireAdminPage } from "@/lib/auth/server";
import { listOrders } from "@/domains/catalog/repository";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { OrderManager } from "@/domains/admin/components/orders/order-manager";

export const dynamic = "force-dynamic";
export default async function AdminOrdersPage() { const admin = await requireAdminPage(); const orders = await listOrders(); return <AdminShell username={admin.name}><OrderManager initialOrders={orders}/></AdminShell>; }
