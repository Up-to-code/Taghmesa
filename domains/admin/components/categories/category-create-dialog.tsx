"use client";

import { FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AdminImageUpload } from "../ui/admin-image-upload";
import { useCreateCategory } from "../../hooks/use-create-category";

export function CategoryCreateDialog({ order }: { order: number }) {
  const { create, busy } = useCreateCategory();
  return <Dialog><DialogTrigger asChild><Button size="lg" className="h-11 rounded-xl bg-cyan-700 px-5 text-white hover:bg-cyan-800"><Plus/>فئة جديدة</Button></DialogTrigger><DialogContent dir="rtl" className="max-h-[92vh] overflow-y-auto sm:max-w-xl"><DialogHeader className="text-right"><span className="mb-1 grid size-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><FolderPlus/></span><DialogTitle className="text-xl font-black">إنشاء فئة جديدة</DialogTitle><DialogDescription>أضف بيانات الفئة وصورتها. بعد الحفظ سننقلك مباشرة لصفحتها لإضافة الفئات الفرعية.</DialogDescription></DialogHeader><form onSubmit={create}><FieldGroup className="py-2"><div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel>الاسم بالعربية</FieldLabel><Input name="nameAr" required placeholder="مثال: أطباق مطبوخة"/></Field><Field><FieldLabel>الاسم بالإنجليزية</FieldLabel><Input name="nameEn" dir="ltr" placeholder="Cooked dishes"/></Field></div><Field><FieldLabel>الرابط المختصر</FieldLabel><Input name="slug" dir="ltr" pattern="[a-z0-9-]+" placeholder="cooked-dishes" required/></Field><AdminImageUpload/><input type="hidden" name="sortOrder" value={order}/></FieldGroup><DialogFooter className="mt-5"><Button disabled={busy} className="bg-cyan-700 text-white hover:bg-cyan-800">{busy ? "جاري الإنشاء…" : "إنشاء والانتقال للفئة"}</Button></DialogFooter></form></DialogContent></Dialog>;
}
