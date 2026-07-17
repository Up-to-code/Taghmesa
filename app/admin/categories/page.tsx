import { requireAdminPage } from "@/lib/auth/server";
import { listCatalogHierarchy } from "@/domains/admin/repository";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { CategoryList } from "@/domains/admin/components/categories/category-list";

export const dynamic = "force-dynamic";
export const metadata = { title: "الفئات — لوحة تحكم تغميسة" };

export default async function CategoriesPage() {
  const admin = await requireAdminPage();
  const categories = await listCatalogHierarchy();
  return <AdminShell username={admin.name}><CategoryList categories={categories}/></AdminShell>;
}
