import { logger } from "@/lib/logger";
import { listProducts } from "./repository";
import { seedProducts } from "./seed-data";

export async function loadStoreProducts() {
  if (!process.env.DATABASE_URL) return seedProducts;
  try {
    return await listProducts(true);
  } catch (error) {
    logger.error("catalog.load_failed", { error: String(error) });
    return seedProducts;
  }
}

export async function loadStoreProduct(id: number) {
  const products = await loadStoreProducts();
  return products.find((product) => product.id === id && product.isActive !== false) ?? null;
}

export async function loadStoreProductWithRecommendations(id: number) {
  const products = await loadStoreProducts();
  const product = products.find((candidate) => candidate.id === id && candidate.isActive !== false) ?? null;
  if (!product) return { product: null, recommendations: [] };

  const activeAlternatives = products.filter((candidate) => candidate.id !== id && candidate.isActive !== false);
  const sameCategory = activeAlternatives.filter((candidate) => candidate.category === product.category);
  const fallback = activeAlternatives.filter((candidate) => candidate.category !== product.category && candidate.isFeatured);

  return { product, recommendations: [...sameCategory, ...fallback].slice(0, 3) };
}
