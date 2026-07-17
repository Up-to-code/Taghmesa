import { requireAdminPage } from "@/lib/auth/server";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { ProductEditorForm } from "@/domains/admin/components/products/product-editor-form";
import { listCatalogHierarchy } from "@/domains/admin/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "منتج جديد — لوحة تحكم تغميسة" };

export default async function NewProductPage() {
  const admin = await requireAdminPage();
  const categories = await listCatalogHierarchy();
  return (
    <AdminShell username={admin.name}>
      <ProductEditorForm categories={categories} />
    </AdminShell>
  );
}
