import { requireAdminPage } from "@/lib/auth/server";
import { listProducts } from "@/domains/catalog/repository";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { ProductGrid } from "@/domains/admin/components/products/product-grid";
import { listCatalogHierarchy } from "@/domains/admin/repository";

export const dynamic = "force-dynamic";
export default async function AdminProductsPage() { const admin = await requireAdminPage(); const [products, categories] = await Promise.all([listProducts(false), listCatalogHierarchy()]); return <AdminShell username={admin.name}><ProductGrid products={products} categories={categories}/></AdminShell>; }
