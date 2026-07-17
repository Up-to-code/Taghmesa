"use client";

import type { Product } from "../types";
import { StoreIcon } from "@/components/shared/store-icon";
import { useProductFilters } from "../hooks/use-product-filters";
import { CatalogSortMenu } from "./catalog-sort-menu";
import { ProductGrid } from "./product-grid";

const categories = ["الكل", "مطبوخ", "غموس", "حلويات", "صوصات"];

export function ShopView({ products, initialCategory, initialQuery }: { products: Product[]; initialCategory?: string; initialQuery?: string }) {
  const filters = useProductFilters(products, categories.includes(initialCategory ?? "") ? initialCategory : "الكل", initialQuery);
  return <div className="shop-layout">
    <aside className="filters">
      <section><h3>الفئات</h3>{categories.map((category) => <button key={category} className={filters.category === category ? "active" : ""} onClick={() => filters.setCategory(category)}><span>{category}</span><b>{category === "الكل" ? products.length : products.filter((product) => product.category === category).length}</b></button>)}</section>
      <section><h3>نطاق السعر</h3><div className="price-inputs"><input aria-label="أقل سعر" type="number" min="0" value={filters.minPrice} onChange={(event) => filters.setMinPrice(Number(event.target.value))}/><input aria-label="أعلى سعر" type="number" min="0" value={filters.maxPrice} onChange={(event) => filters.setMaxPrice(Number(event.target.value))}/></div></section>
    </aside>
    <div className="shop-content"><div className="shop-toolbar">
      <label className="shop-search-field">
        <StoreIcon name="search" size={18}/>
        <input aria-label="البحث في المنتجات" type="search" placeholder="ابحث عن منتج..." value={filters.query} onChange={(event) => filters.setQuery(event.target.value)}/>
      </label>
      <div className="shop-toolbar-actions">
        <output aria-live="polite">{filters.filtered.length} منتج</output>
        <CatalogSortMenu value={filters.sort} onChange={filters.setSort}/>
      </div>
    </div>
      {filters.filtered.length ? <ProductGrid products={filters.filtered}/> : <div className="empty-products">⌕<strong>لا توجد منتجات مطابقة</strong></div>}
    </div>
  </div>;
}
