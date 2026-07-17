"use client";

import { useMemo, useState } from "react";
import type { Product } from "../types";
import { filterProducts, type SortMode } from "../filter-products";

export type { SortMode } from "../filter-products";

export function useProductFilters(products: Product[], initialCategory = "الكل", initialQuery = "") {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sort, setSort] = useState<SortMode>("default");
  const filtered = useMemo(() => filterProducts(products, { category, query, minPrice, maxPrice, sort }), [products, category, query, minPrice, maxPrice, sort]);
  return { filtered, category, setCategory, query, setQuery, minPrice, setMinPrice, maxPrice, setMaxPrice, sort, setSort };
}
