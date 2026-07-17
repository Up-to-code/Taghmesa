"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { adminRequest } from "../api";
import type { AdminCategory, AdminSubcategory } from "../types";

function payload(form: FormData){return{nameAr:form.get("nameAr"),nameEn:form.get("nameEn"),slug:form.get("slug"),isActive:form.get("isActive")==="on",sortOrder:Number(form.get("sortOrder")??0)}}
export function useCategoryDetail(initial:AdminCategory){const router=useRouter();const[category,setCategory]=useState(initial);const[busy,setBusy]=useState(false);
  async function run(action:()=>Promise<void>){setBusy(true);try{await action()}catch(error){toast.error(error instanceof Error?error.message:"تعذّر تنفيذ العملية")}finally{setBusy(false)}}
  function save(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);void run(async()=>{const updated=await adminRequest<AdminCategory>(`/categories/${category.id}`,{method:"PATCH",body:JSON.stringify(payload(form))});const file=form.get("image");let imageUrl=updated.imageUrl;if(file instanceof File&&file.size){const upload=new FormData();upload.set("file",file);imageUrl=(await adminRequest<{imageUrl:string}>(`/categories/${category.id}/image`,{method:"POST",body:upload})).imageUrl}setCategory(current=>({...current,...updated,imageUrl}));toast.success("تم حفظ الفئة");router.refresh()})}
  function addSubcategory(event:FormEvent<HTMLFormElement>){event.preventDefault();const element=event.currentTarget;const form=new FormData(element);void run(async()=>{const created=await adminRequest<AdminSubcategory>("/subcategories",{method:"POST",body:JSON.stringify({...payload(form),categoryId:category.id})});setCategory(current=>({...current,subcategories:[...current.subcategories,{...created,productCount:0}]}));element.reset();toast.success("تمت إضافة الفئة الفرعية")})}
  function saveSubcategory(event:FormEvent<HTMLFormElement>,item:AdminSubcategory){event.preventDefault();const form=new FormData(event.currentTarget);void run(async()=>{const updated=await adminRequest<AdminSubcategory>(`/subcategories/${item.id}`,{method:"PATCH",body:JSON.stringify({...payload(form),categoryId:category.id})});setCategory(current=>({...current,subcategories:current.subcategories.map(sub=>sub.id===item.id?{...sub,...updated}:sub)}));toast.success("تم حفظ الفئة الفرعية")})}
  function deleteSubcategory(item:AdminSubcategory){if(!confirm(`حذف ${item.nameAr}؟`))return;void run(async()=>{await adminRequest(`/subcategories/${item.id}`,{method:"DELETE"});setCategory(current=>({...current,subcategories:current.subcategories.filter(sub=>sub.id!==item.id)}));toast.success("تم الحذف")})}
  function deleteCategory(){if(!confirm(`حذف فئة ${category.nameAr}؟`))return;void run(async()=>{await adminRequest(`/categories/${category.id}`,{method:"DELETE"});toast.success("تم حذف الفئة");router.push("/admin/categories");router.refresh()})}
  return{category,busy,save,addSubcategory,saveSubcategory,deleteSubcategory,deleteCategory}}
