import type { Product } from "./types";

export type SortMode = "default" | "price-asc" | "price-desc" | "name";

export function filterProducts(products: Product[], options: { category: string; query: string; minPrice: number; maxPrice: number; sort: SortMode }) {
  const normalized = options.query.trim().toLocaleLowerCase();
  const list = products.filter((product) => options.category === "الكل" || product.category === options.category)
    .filter((product) => !normalized || product.nameAr.includes(normalized) || product.nameEn.toLocaleLowerCase().includes(normalized))
    .filter((product) => product.sizes[0] && product.sizes[0].price >= options.minPrice && product.sizes[0].price <= options.maxPrice);
  if (options.sort === "price-asc") return [...list].sort((a, b) => a.sizes[0].price - b.sizes[0].price);
  if (options.sort === "price-desc") return [...list].sort((a, b) => b.sizes[0].price - a.sizes[0].price);
  if (options.sort === "name") return [...list].sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar"));
  return list;
}
