import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/server";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { CategoryDetail } from "@/domains/admin/components/categories/category-detail";
import { listCatalogHierarchy } from "@/domains/admin/repository";

export const dynamic="force-dynamic";
export default async function CategoryDetailPage({params}:{params:Promise<{id:string}>}){const admin=await requireAdminPage();const{id}=await params;const category=(await listCatalogHierarchy()).find(item=>item.id===Number(id));if(!category)notFound();return <AdminShell username={admin.name}><CategoryDetail initialCategory={category}/></AdminShell>}
