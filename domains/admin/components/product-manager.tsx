"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { Product, ProductSize } from "@/domains/catalog/types";
import { adminRequest } from "../api";

const categories = ["مطبوخ", "غموس", "حلويات", "صوصات"];

function AddSizeRow({ onAdd }: { onAdd: (input: { label: string; price: number; caloriesLabel: string }) => Promise<void> }) {
  const [label, setLabel] = useState(""); const [price, setPrice] = useState(0); const [caloriesLabel, setCaloriesLabel] = useState("");
  async function add() { if (!label || price < 0) return; await onAdd({ label, price, caloriesLabel }); setLabel(""); setPrice(0); setCaloriesLabel(""); }
  return <div className="admin-size-row add-size"><input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="حجم جديد"/><input value={price || ""} onChange={(event) => setPrice(Number(event.target.value))} type="number" min="0" step="0.01" placeholder="السعر"/><input value={caloriesLabel} onChange={(event) => setCaloriesLabel(event.target.value)} placeholder="السعرات"/><button type="button" onClick={add}>إضافة</button></div>;
}

function productPayload(form: FormData, product: Product) {
  return { nameAr: form.get("nameAr"), nameEn: form.get("nameEn"), category: form.get("category"), emoji: form.get("emoji"), description: form.get("description"), isActive: form.get("isActive") === "on", isFeatured: form.get("isFeatured") === "on", isNew: form.get("isNew") === "on", sortOrder: product.sortOrder ?? 999 };
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts); const [message, setMessage] = useState("");
  function replaceSize(productId: number, updated: ProductSize) { setProducts((current) => current.map((product) => product.id === productId ? { ...product, sizes: product.sizes.map((size) => size.id === updated.id ? updated : size) } : product)); }
  async function saveProduct(event: FormEvent<HTMLFormElement>, product: Product) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try {
      await adminRequest(`/products/${product.id}`, { method: "PATCH", body: JSON.stringify(productPayload(form, product)) });
      for (const size of product.sizes) await adminRequest(`/sizes/${size.id}`, { method: "PATCH", body: JSON.stringify({ label: size.label, price: size.price, caloriesLabel: size.caloriesLabel, sortOrder: 0 }) });
      const file = form.get("image"); if (file instanceof File && file.size) { const upload = new FormData(); upload.set("file", file); const result = await adminRequest<{ imageUrl: string }>(`/products/${product.id}/image`, { method: "POST", body: upload }); setProducts((current) => current.map((item) => item.id === product.id ? { ...item, imageUrl: result.imageUrl } : item)); }
      setMessage(`تم حفظ التعديلات على ${product.nameAr}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذّر الحفظ"); }
  }
  async function addSize(productId: number, input: { label: string; price: number; caloriesLabel: string }) {
    try { const created = await adminRequest<{ id: number; label: string; price: string; caloriesLabel: string }>(`/products/${productId}/sizes`, { method: "POST", body: JSON.stringify({ ...input, sortOrder: 99 }) }); setProducts((current) => current.map((product) => product.id === productId ? { ...product, sizes: [...product.sizes, { id: created.id, label: created.label, price: Number(created.price), caloriesLabel: created.caloriesLabel }] } : product)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "تعذّرت إضافة الحجم"); }
  }
  async function deleteSize(productId: number, sizeId: number) { if (!confirm("حذف هذا الحجم؟")) return; try { await adminRequest(`/sizes/${sizeId}`, { method: "DELETE" }); setProducts((current) => current.map((product) => product.id === productId ? { ...product, sizes: product.sizes.filter((size) => size.id !== sizeId) } : product)); } catch (error) { setMessage(error instanceof Error ? error.message : "تعذّر الحذف"); } }
  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { const created = await adminRequest<{ id: number }>("/products", { method: "POST", body: JSON.stringify({ nameAr: form.get("nameAr"), nameEn: form.get("nameEn"), category: form.get("category"), emoji: form.get("emoji"), description: form.get("description"), isActive: true, isFeatured: false, isNew: false, sortOrder: 999, size: { label: form.get("sizeLabel"), price: Number(form.get("price")), caloriesLabel: form.get("calories"), sortOrder: 1 } }) }); const file = form.get("image"); if (file instanceof File && file.size) { const upload = new FormData(); upload.set("file", file); await adminRequest(`/products/${created.id}/image`, { method: "POST", body: upload }); } setMessage("تمت إضافة المنتج بنجاح"); window.location.reload(); return created; }
    catch (error) { setMessage(error instanceof Error ? error.message : "تعذّرت إضافة المنتج"); }
  }
  return <><div className="admin-page-title"><h1>المنتجات ({products.length})</h1>{message && <span>{message}</span>}</div>{products.map((product) => <details className="admin-card product-admin-card" key={product.id}><summary><span className="admin-product-title">{product.imageUrl ? <Image src={product.imageUrl} alt="" width={54} height={54}/> : <i>{product.emoji}</i>}<strong>{product.nameAr} — {product.category}</strong></span><b className={product.isActive ? "enabled" : "disabled"}>{product.isActive ? "مفعّل" : "مخفي"}</b></summary><form className="admin-form" onSubmit={(event) => saveProduct(event, product)}><div className="admin-grid"><label>الاسم بالعربي<input name="nameAr" defaultValue={product.nameAr} required/></label><label>الاسم بالإنجليزي<input name="nameEn" defaultValue={product.nameEn}/></label><label>الفئة<select name="category" defaultValue={product.category}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>الإيموجي<input name="emoji" defaultValue={product.emoji}/></label></div><label>الوصف<textarea name="description" defaultValue={product.description}/></label><label>صورة جديدة<input name="image" type="file" accept=".jpg,.jpeg,.png,.webp"/></label><div className="admin-sizes"><h3>الأحجام والأسعار</h3>{product.sizes.map((size) => <div className="admin-size-row" key={size.id}><input aria-label="الحجم" value={size.label} onChange={(event) => replaceSize(product.id, { ...size, label: event.target.value })}/><input aria-label="السعر" type="number" step="0.01" min="0" value={size.price} onChange={(event) => replaceSize(product.id, { ...size, price: Number(event.target.value) })}/><input aria-label="السعرات" value={size.caloriesLabel} onChange={(event) => replaceSize(product.id, { ...size, caloriesLabel: event.target.value })}/><button type="button" onClick={() => deleteSize(product.id, size.id)}>حذف</button></div>)}<AddSizeRow onAdd={(input) => addSize(product.id, input)}/></div><div className="admin-checks"><label><input type="checkbox" name="isActive" defaultChecked={product.isActive}/> مفعّل</label><label><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured}/> مميز</label><label><input type="checkbox" name="isNew" defaultChecked={product.isNew}/> جديد</label></div><button className="primary-button" type="submit">حفظ التعديلات</button></form></details>)}<form className="admin-card admin-form" onSubmit={addProduct}><h2>إضافة منتج جديد</h2><div className="admin-grid"><label>الاسم بالعربي<input required name="nameAr"/></label><label>الاسم بالإنجليزي<input name="nameEn"/></label><label>الفئة<select name="category">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>الإيموجي<input name="emoji" defaultValue="🍽️"/></label></div><label>الوصف<textarea name="description"/></label><label>صورة المنتج (اختياري)<input name="image" type="file" accept=".jpg,.jpeg,.png,.webp"/></label><div className="admin-grid"><label>الحجم الأول<input required name="sizeLabel" defaultValue="الحصة"/></label><label>السعر<input required name="price" type="number" step="0.01" min="0"/></label><label>السعرات<input name="calories"/></label></div><button className="primary-button" type="submit">إضافة المنتج</button></form></>;
}
