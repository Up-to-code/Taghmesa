type StoreLoadingVariant = "shop" | "search" | "product" | "checkout";

function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`route-skeleton ${className}`} aria-hidden="true" />;
}

function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return <article className={`route-product-skeleton${compact ? " compact" : ""}`} aria-hidden="true">
    <Skeleton className="route-product-image" />
    <div className="route-product-copy">
      <Skeleton className="route-line route-line-title" />
      <Skeleton className="route-line route-line-short" />
      <Skeleton className="route-line" />
      <div className="route-product-actions"><Skeleton /><Skeleton /></div>
    </div>
  </article>;
}

function ShopLoading() {
  return <div className="route-loading route-shop-loading">
    <header className="route-shop-intro">
      <Skeleton className="route-eyebrow" />
      <Skeleton className="route-heading" />
      <Skeleton className="route-copy" />
    </header>
    <div className="route-shop-layout">
      <aside className="route-filter-skeleton">
        <Skeleton className="route-line route-line-title" />
        {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="route-filter-row" />)}
      </aside>
      <section className="route-results-skeleton">
        <div className="route-toolbar-skeleton"><Skeleton /><Skeleton /></div>
        <div className="route-product-grid">{Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}</div>
      </section>
    </div>
  </div>;
}

function SearchLoading() {
  return <div className="route-loading route-search-loading">
    <header className="route-search-header"><Skeleton className="route-round" /><div><Skeleton className="route-line route-line-short" /><Skeleton className="route-line route-line-title" /></div></header>
    <section className="route-search-intro"><Skeleton className="route-eyebrow" /><Skeleton className="route-heading" /><Skeleton className="route-copy" /></section>
    <Skeleton className="route-search-field" />
    <div className="route-section-heading"><Skeleton className="route-line route-line-title" /><Skeleton className="route-line route-line-short" /></div>
    <div className="route-category-row">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} />)}</div>
    <div className="route-section-heading"><Skeleton className="route-line route-line-title" /><Skeleton className="route-line route-line-short" /></div>
    <div className="route-search-products">{Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} compact />)}</div>
  </div>;
}

function ProductLoading() {
  return <main className="route-loading route-detail-loading">
    <div className="route-breadcrumb"><Skeleton /><Skeleton /><Skeleton /></div>
    <section className="route-detail-grid">
      <div className="route-detail-media"><Skeleton className="route-detail-image" /><div>{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} />)}</div></div>
      <article className="route-detail-copy">
        <Skeleton className="route-eyebrow" />
        <Skeleton className="route-heading" />
        <Skeleton className="route-line route-line-short" />
        <Skeleton className="route-copy" />
        <Skeleton className="route-copy route-copy-short" />
        <div className="route-pill-row">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} />)}</div>
        <div className="route-detail-panel"><Skeleton className="route-line route-line-title" /><div className="route-pill-row">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} />)}</div><Skeleton className="route-detail-button" /></div>
      </article>
    </section>
  </main>;
}

function CheckoutLoading() {
  return <div className="route-loading route-checkout-loading">
    <header><Skeleton className="route-heading" /><Skeleton className="route-copy" /></header>
    <section className="route-checkout-grid">
      <div className="route-checkout-form"><Skeleton className="route-line route-line-title" />{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="route-input" />)}<Skeleton className="route-detail-button" /></div>
      <aside><Skeleton className="route-line route-line-title" />{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="route-order-row" />)}</aside>
    </section>
  </div>;
}

export function StoreRouteLoading({ variant }: { variant: StoreLoadingVariant }) {
  return <div role="status" aria-live="polite" aria-busy="true" aria-label="جاري تحميل الصفحة">
    {variant === "shop" ? <ShopLoading /> : variant === "search" ? <SearchLoading /> : variant === "product" ? <ProductLoading /> : <CheckoutLoading />}
  </div>;
}
