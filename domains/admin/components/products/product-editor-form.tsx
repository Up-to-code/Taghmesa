"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleDollarSign,
  Eye,
  FileText,
  PackagePlus,
  Plus,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";
import type { Product } from "@/domains/catalog/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminCategory } from "../../types";
import { useProductEditor } from "../../hooks/use-product-editor";
import { AdminImageUpload } from "../ui/admin-image-upload";
import { AdminPageHeader } from "../ui/admin-page-header";
import { RichTextEditor } from "../ui/rich-text-editor";

export function ProductEditorForm({
  product,
  categories,
}: {
  product?: Product;
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const editor = useProductEditor(product, categories, ({ action, productId }) => {
    if (action === "deleted") {
      router.push("/admin/products");
      return;
    }
    if (action === "created") router.replace(`/admin/products/${productId}`);
  });
  return (
    <>
      <div className="mb-4">
        <Button asChild variant="ghost">
          <Link href="/admin/products"><ArrowRight />العودة إلى المنتجات</Link>
        </Button>
      </div>
      <AdminPageHeader
        eyebrow={product ? "تعديل المنتج" : "منتج جديد"}
        title={product ? product.nameAr : "إضافة منتج جديد"}
        description="نظّم بيانات المنتج ومحتواه وربطه بالفئة والفئة الفرعية ثم احفظه."
      />
      <Card className="overflow-hidden border-slate-200/80 py-0 shadow-none">
        <CardHeader className="border-b bg-gradient-to-l from-cyan-50 via-white to-slate-50 p-5 text-right">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
              {product ? <Settings2 /> : <PackagePlus />}
            </span>
            <div className="min-w-0 pt-0.5">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">
                  {product ? `تعديل ${product.nameAr}` : "إضافة منتج جديد"}
                </h2>
                {product && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-black ${
                      product.isActive !== false
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {product.isActive !== false ? "ظاهر في المتجر" : "مخفي"}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                نظّم البيانات والمحتوى والأسعار والحالة في أقسام واضحة.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
        <form onSubmit={editor.submit}>
          <Tabs defaultValue="details" dir="rtl" className="gap-0">
            <TabsList className="mx-5 mt-4 h-12 w-[calc(100%-2.5rem)] justify-start overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1">
              <TabsTrigger
                value="details"
                className="h-9 px-4 data-active:bg-cyan-700 data-active:text-white"
              >
                <PackagePlus />
                البيانات
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="h-9 px-4 data-active:bg-cyan-700 data-active:text-white"
              >
                <FileText />
                المحتوى
              </TabsTrigger>
              <TabsTrigger
                value="options"
                className="h-9 px-4 data-active:bg-cyan-700 data-active:text-white"
              >
                <CircleDollarSign />
                الخيارات
              </TabsTrigger>
            </TabsList>
            <div className="min-h-[430px] p-5">
              <TabsContent value="details" forceMount className="data-[state=inactive]:hidden">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>الاسم بالعربية</FieldLabel>
                      <Input
                        name="nameAr"
                        defaultValue={product?.nameAr}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>الاسم بالإنجليزية</FieldLabel>
                      <Input
                        name="nameEn"
                        dir="ltr"
                        defaultValue={product?.nameEn}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>الفئة</FieldLabel>
                      <Select
                        value={editor.categoryId}
                        onValueChange={(value) => {
                          editor.setCategoryId(value);
                          editor.setSubcategoryId("");
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>الفئة الفرعية</FieldLabel>
                      <Select
                        value={editor.subcategoryId || "none"}
                        onValueChange={(value) =>
                          editor.setSubcategoryId(value === "none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="بدون فئة فرعية" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="none">بدون فئة فرعية</SelectItem>
                          {editor.availableSubcategories.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.nameAr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>الإيموجي</FieldLabel>
                      <Input
                        name="emoji"
                        defaultValue={product?.emoji ?? "🍽️"}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>الترتيب</FieldLabel>
                      <Input
                        name="sortOrder"
                        type="number"
                        defaultValue={product?.sortOrder ?? 999}
                      />
                    </Field>
                  </div>
                  <AdminImageUpload
                    currentUrl={product?.imageUrl}
                    label="صورة المنتج"
                  />
                </FieldGroup>
              </TabsContent>
              <TabsContent value="content" forceMount className="data-[state=inactive]:hidden">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/45 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white">
                      <FileText />
                    </span>
                    <div>
                      <b className="block text-sm">محرر وصف المنتج</b>
                      <small className="text-[10px] text-slate-500">
                        اكتب نصاً منظماً وغنياً بالتفاصيل ليظهر في صفحة المنتج.
                      </small>
                    </div>
                  </div>
                <Field>
                  <FieldLabel>الوصف</FieldLabel>
                  <RichTextEditor name="description" defaultValue={product?.description}/>
                </Field>
                </div>
              </TabsContent>
              <TabsContent value="options" forceMount className="data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black">الأحجام والأسعار</h3>
                      <p className="text-xs text-slate-500">
                        أضف كل خيارات الشراء المتاحة.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={editor.addSize}
                    >
                      <Plus />
                      إضافة حجم
                    </Button>
                  </div>
                  {editor.sizes.map((size) => (
                    <div
                      key={size.id}
                      className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_130px_1fr_auto]"
                    >
                      <Input
                        aria-label="اسم الحجم"
                        value={size.label}
                        onChange={(event) =>
                          editor.updateSize(size.id, {
                            label: event.target.value,
                          })
                        }
                        placeholder="الحجم"
                        required
                      />
                      <Input
                        aria-label="السعر"
                        value={size.price || ""}
                        onChange={(event) =>
                          editor.updateSize(size.id, {
                            price: Number(event.target.value),
                          })
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="السعر"
                        required
                      />
                      <Input
                        aria-label="السعرات"
                        value={size.caloriesLabel}
                        onChange={(event) =>
                          editor.updateSize(size.id, {
                            caloriesLabel: event.target.value,
                          })
                        }
                        placeholder="السعرات"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => editor.removeSize(size)}
                      >
                        <Trash2 />
                        <span className="sr-only">حذف الحجم</span>
                      </Button>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Eye />
                      </span>
                      <div>
                        <h3 className="font-black">حالة ظهور المنتج</h3>
                        <p className="text-[10px] text-slate-500">
                          تظهر هذه الحالات مباشرة على بطاقة المنتج وفي لوحة المتابعة.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["isActive", "ظاهر في المتجر", "يمكن للعملاء رؤيته وطلبه", product?.isActive ?? true],
                      ["isFeatured", "منتج مميز", "يظهر ضمن الاختيارات المميزة", product?.isFeatured ?? false],
                      ["isNew", "شارة منتج جديد", "أضف شارة جديد على المنتج", product?.isNew ?? false],
                    ].map(([name, label, description, checked]) => (
                      <label
                        key={String(name)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <span className="min-w-0">
                          <b className="block text-xs">{String(label)}</b>
                          <small className="mt-0.5 block text-[9px] font-normal leading-4 text-slate-400">
                            {String(description)}
                          </small>
                        </span>
                        <Switch
                          name={String(name)}
                          defaultChecked={Boolean(checked)}
                        />
                      </label>
                    ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <footer className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
            <Button
              disabled={editor.busy}
              className="bg-cyan-700 text-white hover:bg-cyan-800"
            >
              <Save />
              {editor.busy ? "جاري الحفظ…" : "حفظ المنتج"}
            </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/products">
                إلغاء
                </Link>
              </Button>
            {product && (
              <Button
                type="button"
                variant="destructive"
                disabled={editor.busy}
                onClick={editor.deleteProduct}
              >
                <Trash2 />
                حذف المنتج
              </Button>
            )}
          </footer>
        </form>
        </CardContent>
      </Card>
    </>
  );
}
