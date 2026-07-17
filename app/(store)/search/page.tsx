import { SearchView } from "@/domains/catalog/components/search-view";
import { loadStoreProducts } from "@/domains/catalog/load-products";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [products, params] = await Promise.all([loadStoreProducts(), searchParams]);
  return <SearchView products={products} initialQuery={params.q}/>;
}
