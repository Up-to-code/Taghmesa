import { ShopView } from "@/domains/catalog/components/shop-view";
import { CatalogIntroDoodles } from "@/domains/catalog/components/catalog-flavor-art";
import { loadStoreProducts } from "@/domains/catalog/load-products";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [products, params] = await Promise.all([loadStoreProducts(), searchParams]);
  return <div className="shop-page"><header className="shop-intro"><CatalogIntroDoodles/><span>THE TAGHMESA COLLECTION</span><div className="shop-title-lockup"><h1>متجر تغميسة</h1><svg viewBox="0 0 260 24" preserveAspectRatio="none" aria-hidden="true"><path className="shop-title-swash" d="M6 12c56 8 153 8 248-3"/><path className="shop-title-thread" d="M34 16c54 4 127 3 190-2"/><path className="shop-title-seal" d="m236 6 7 6-8 7-7-6Z"/></svg></div><p>اكتشف أطباقاً وتغميسات محضّرة بعناية، واختر الحجم المناسب لمائدتك.</p></header><ShopView products={products} initialCategory={params.category} initialQuery={params.q}/></div>;
}
