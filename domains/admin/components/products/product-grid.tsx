"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ImageIcon,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/domains/catalog/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminCategory } from "../../types";
import { AdminPageHeader } from "../ui/admin-page-header";

function ProductCard({
  product,
}: {
  product: Product;
}) {
  const prices = product.sizes.map((size) => size.price);
  const minimumPrice = prices.length ? Math.min(...prices) : null;
  const isActive = product.isActive !== false;

  return (
    <Card
      className={`group overflow-hidden py-0 transition-all hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/5 ${
        isActive ? "border-slate-200/80" : "border-rose-200/80 bg-rose-50/20"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.nameAr}
            fill
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              isActive ? "" : "grayscale-[.35]"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 text-6xl">
            {product.emoji || <ImageIcon className="size-14 text-cyan-300" />}
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/35 to-transparent" />
        <Badge
          className={`absolute right-3 top-3 gap-1.5 border-0 shadow-sm backdrop-blur ${
            isActive
              ? "bg-emerald-500/95 text-white"
              : "bg-rose-500/95 text-white"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {isActive ? "ظاهر في المتجر" : "مخفي"}
        </Badge>

        <Button
              asChild
              type="button"
              size="icon"
              variant="secondary"
              title={`تعديل ${product.nameAr}`}
              className="absolute left-3 top-3 z-10 size-10 rounded-xl border border-white/50 bg-white/95 text-slate-700 shadow-lg backdrop-blur hover:bg-cyan-700 hover:text-white"
            >
              <Link href={`/admin/products/${product.id}`} aria-label={`تعديل ${product.nameAr}`}>
                <Pencil className="size-4" />
              </Link>
            </Button>

        {(product.isNew || product.isFeatured) && (
          <div className="absolute bottom-3 right-3 flex flex-wrap gap-1.5">
            {product.isNew && (
              <Badge className="border-0 bg-blue-600 text-white">جديد</Badge>
            )}
            {product.isFeatured && (
              <Badge className="border-0 bg-amber-400 text-amber-950">
                <Sparkles className="size-3" />
                مميز
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <small className="font-bold text-cyan-700">{product.category}</small>
          <small className="font-mono text-[9px] text-slate-300" dir="ltr">
            #{product.id}
          </small>
        </div>
        <h2 className="text-lg font-black text-slate-950">{product.nameAr}</h2>
        <p className="mt-1 truncate text-[10px] text-slate-400" dir="ltr">
          {product.nameEn || "—"}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <span>
            <small className="block text-[9px] text-slate-400">يبدأ من</small>
            <b className="text-lg text-slate-900">
              {minimumPrice === null
                ? "لم يحدد"
                : `${minimumPrice.toFixed(2)} ر.س`}
            </b>
          </span>
          <span className="rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-500">
            {product.sizes.length.toLocaleString("ar-SA")} خيارات
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: AdminCategory[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "all" || String(product.categoryId) === category;
      const matchesQuery =
        !normalizedQuery ||
        `${product.nameAr} ${product.nameEn} ${product.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  if (!categories.length) {
    return (
      <Card className="border-dashed py-16 text-center">
        <CardContent>
          <PackageOpen className="mx-auto mb-4 size-12 text-cyan-200" />
          <h2 className="font-black">أنشئ فئة أولاً</h2>
          <p className="mt-2 text-sm text-slate-500">
            يحتاج كل منتج إلى فئة حتى يظهر منظماً في المتجر.
          </p>
          <Button asChild className="mt-5 bg-cyan-700 text-white hover:bg-cyan-800">
            <Link href="/admin/categories">الذهاب إلى الفئات</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="إدارة الكتالوج"
        title="المنتجات"
        description="راجع حالة كل منتج وعدّل صورته ومحتواه وخياراته من مكان واحد."
        action={
              <Button
                asChild
                size="lg"
                className="h-11 rounded-xl bg-cyan-700 px-5 text-white hover:bg-cyan-800"
              >
                <Link href="/admin/products/new"><Plus />منتج جديد</Link>
              </Button>
        }
      />

      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 md:grid-cols-[minmax(240px,1fr)_220px]">
        <label className="relative">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 bg-white pr-10 shadow-none"
            placeholder="ابحث باسم المنتج أو الفئة…"
          />
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-11 w-full bg-white shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="all">كل الفئات</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          عرض <b className="text-slate-900">{visible.length.toLocaleString("ar-SA")}</b> من{" "}
          {products.length.toLocaleString("ar-SA")} منتج
        </span>
        {(query || category !== "all") && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            مسح التصفية
          </Button>
        )}
      </div>

      {visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed py-14 text-center">
          <CardContent>
            <PackageOpen className="mx-auto mb-3 size-10 text-slate-300" />
            <h2 className="font-black">لا توجد نتائج</h2>
            <p className="mt-1 text-sm text-slate-500">
              جرّب عبارة أو فئة أو حالة مختلفة.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
