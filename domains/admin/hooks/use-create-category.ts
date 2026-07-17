"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { adminRequest } from "../api";
import type { AdminCategory } from "../types";

export function useCreateCategory() {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const form = new FormData(event.currentTarget);
    try {
      const created = await adminRequest<AdminCategory>("/categories", { method: "POST", body: JSON.stringify({ nameAr: form.get("nameAr"), nameEn: form.get("nameEn"), slug: form.get("slug"), isActive: true, sortOrder: Number(form.get("sortOrder") ?? 0) }) });
      const file=form.get("image"); if(file instanceof File && file.size){const upload=new FormData();upload.set("file",file);await adminRequest(`/categories/${created.id}/image`,{method:"POST",body:upload});}
      toast.success("تم إنشاء الفئة"); router.push(`/admin/categories/${created.id}`); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذّر إنشاء الفئة"); setBusy(false); }
  }
  return { create, busy };
}
