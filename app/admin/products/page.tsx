import { requireAdminPage } from "@/lib/auth/server";
import { listProducts } from "@/domains/catalog/repository";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { ProductManager } from "@/domains/admin/components/product-manager";

export const dynamic = "force-dynamic";
export default async function AdminProductsPage() { const admin = await requireAdminPage(); const products = await listProducts(false); return <AdminShell username={admin.name}><ProductManager initialProducts={products}/></AdminShell>; }
