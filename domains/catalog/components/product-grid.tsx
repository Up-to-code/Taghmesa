import type { Product } from "../types";
import { ProductCard } from "./product-card";

type ProductGridVariant = "grid" | "search" | "mobile-list";

export function ProductGrid({ products, variant = "grid" }: { products: Product[]; variant?: ProductGridVariant }) {
  const variantClass = variant === "search" ? " search-product-list" : variant === "mobile-list" ? " mobile-product-list" : "";
  return <div className={`products-grid${variantClass}`}>{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0} variant={variant}/>)}</div>;
}
