import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/server";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { ProductEditorForm } from "@/domains/admin/components/products/product-editor-form";
import { listCatalogHierarchy } from "@/domains/admin/repository";
import { listProducts } from "@/domains/catalog/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "تعديل المنتج — لوحة تحكم تغميسة" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdminPage();
  const { id } = await params;
  const [categories, products] = await Promise.all([
    listCatalogHierarchy(),
    listProducts(false),
  ]);
  const product = products.find((item) => item.id === Number(id));
  if (!product) notFound();
  return (
    <AdminShell username={admin.name}>
      <ProductEditorForm product={product} categories={categories} />
    </AdminShell>
  );
}
