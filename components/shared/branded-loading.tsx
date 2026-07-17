export function BrandedLoading() {
  return <main className="system-loading" role="status" aria-live="polite" aria-label="جاري تحميل الصفحة">
    <div className="loading-page-shell" aria-hidden="true">
      <header className="loading-page-header">
        <div className="loading-page-brand">
          <span className="route-skeleton loading-avatar"/>
          <span className="loading-brand-lines"><i className="route-skeleton"/><i className="route-skeleton"/></span>
        </div>
        <span className="route-skeleton loading-account"/>
      </header>

      <section className="loading-page-hero">
        <span className="route-skeleton loading-kicker"/>
        <span className="route-skeleton loading-title"/>
        <span className="route-skeleton loading-title loading-title-short"/>
        <span className="route-skeleton loading-search"/>
        <span className="route-skeleton loading-promo"/>
        <span className="loading-feature-row">
          {Array.from({ length: 5 }, (_, index) => <i className="route-skeleton" key={index}/>) }
        </span>
      </section>

      <section className="loading-page-content">
        <span className="route-skeleton loading-section-title"/>
        <span className="loading-card-row">
          {Array.from({ length: 3 }, (_, index) => <i className="route-skeleton" key={index}/>) }
        </span>
      </section>

      <nav className="loading-page-navigation">
        {Array.from({ length: 5 }, (_, index) => <span key={index}><i className="route-skeleton"/><b className="route-skeleton"/></span>) }
      </nav>
    </div>
  </main>;
}
