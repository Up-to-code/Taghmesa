"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreIcon } from "@/components/shared/store-icon";
import type { Product } from "../types";
import { useProductFilters } from "../hooks/use-product-filters";
import { ProductGrid } from "./product-grid";

const categories = [
  { value: "الكل", label: "الكل", image: "/products/8.webp" },
  { value: "مطبوخ", label: "أطباق مطبوخة", image: "/products/1.webp" },
  { value: "غموس", label: "غموس", image: "/products/8.webp" },
  { value: "حلويات", label: "حلويات", image: "/products/7.webp" },
  { value: "صوصات", label: "صوصات", image: "/products/9.webp" },
] as const;

export function SearchView({ products, initialQuery }: { products: Product[]; initialQuery?: string }) {
  const filters = useProductFilters(products, "الكل", initialQuery);
  return <div className="mobile-search-page">
    <header className="mobile-search-head">
      <Link href="/" aria-label="العودة للرئيسية"><span aria-hidden="true">→</span></Link>
      <div><small>متجر تغميسة</small><strong>البحث</strong></div>
    </header>

    <section className="search-intro" aria-labelledby="search-page-title">
      <span>كل النكهات في مكان واحد</span>
      <h1 id="search-page-title">دوّري على <em>نكهتك</em></h1>
      <p>اكتبي اسم الطبق، أو اختاري فئة وخلّي الباقي علينا.</p>
    </section>

    <div className="search-field-wrap">
      <label className="search-page-field">
        <StoreIcon name="search" size={21}/>
        <span className="search-field-label">ابحثي في المنتجات</span>
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={filters.query}
          onChange={(event) => filters.setQuery(event.target.value)}
          placeholder="مثلاً: ورق عنب أو صوص..."
        />
        {filters.query && <button type="button" onClick={() => filters.setQuery("")} aria-label="مسح البحث"><StoreIcon name="close" size={17}/></button>}
      </label>
    </div>

    <section className="search-categories" aria-labelledby="search-categories-title">
      <div className="search-section-head">
        <div><small>تصفّح سريع</small><h2 id="search-categories-title">اختاري الفئة</h2></div>
        <span>اسحبي للمزيد</span>
      </div>
      <div className="search-category-scroll">
        <div className="search-category-grid">
          {categories.map((category) => {
            const count = category.value === "الكل" ? products.length : products.filter((product) => product.category === category.value).length;
            const selected = filters.category === category.value;
            return <button key={category.value} type="button" className={selected ? "active" : ""} onClick={() => filters.setCategory(category.value)} aria-pressed={selected}>
              <span className="search-category-image"><Image src={category.image} alt="" fill sizes="48px"/></span>
              <span className="search-category-copy"><strong>{category.label}</strong><small>{count} {count === 1 ? "منتج" : "منتجات"}</small></span>
              <span className="search-category-check" aria-hidden="true"><StoreIcon name="check" size={14}/></span>
            </button>;
          })}
        </div>
      </div>
    </section>

    <section className="search-results" aria-labelledby="search-results-title">
      <div className="search-section-head search-results-head">
        <div><small>النتائج</small><h2 id="search-results-title">{filters.query ? `نتائج “${filters.query}”` : filters.category === "الكل" ? "كل المنتجات" : categories.find((category) => category.value === filters.category)?.label}</h2></div>
        <output aria-live="polite">{filters.filtered.length} {filters.filtered.length === 1 ? "نتيجة" : "نتائج"}</output>
      </div>
      {filters.filtered.length ? <ProductGrid products={filters.filtered} variant="search"/> : <div className="empty-products"><span><StoreIcon name="search" size={28}/></span><strong>ما لقينا نتيجة مطابقة</strong><p>جرّبي كلمة أقصر أو اختاري فئة ثانية.</p><button type="button" onClick={() => { filters.setQuery(""); filters.setCategory("الكل"); }}>عرض كل المنتجات</button></div>}
    </section>
  </div>;
}
