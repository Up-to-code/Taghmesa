import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "@/domains/catalog/components/product-grid";
import { loadStoreProducts } from "@/domains/catalog/load-products";
import { StoreIcon } from "@/components/shared/store-icon";
import { HomeHeroCarousel } from "@/domains/catalog/components/mobile-hero-carousel";
import { HeroFlavorDoodles } from "@/domains/catalog/components/catalog-flavor-art";

export const dynamic = "force-dynamic";

const features = [
  { icon: "leaf", title: "طازج", description: "مكونات طازجة يومياً بدون مواد حافظة" },
  { icon: "sun", title: "طبيعي", description: "100% طبيعي بدون إضافات اصطناعية" },
  { icon: "heart", title: "صنع يدوي", description: "محضّر بيد أمينة باهتمام في كل تفصيل" },
  { icon: "users", title: "للمشاركة", description: "مثالي للعائلة والأصدقاء في كل مناسبة" },
  { icon: "award", title: "جودة عالية", description: "لا نتنازل عن الجودة في أي منتج" },
] as const;

export default async function HomePage() {
  const products = await loadStoreProducts();
  return <>
    <section className="hero">
      <HeroFlavorDoodles/>
      <div className="mobile-home-intro">
        <div className="mobile-welcome"><div><small>تغميسة · نكهات أصيلة منذ 2023</small><h1>اكتشف <em>نكهاتنا</em><br/>الطازجة معاً</h1><p>أطباق وتغميسات منزلية محضّرة يومياً بعناية، لتجمع أحبابك حول سفرة واحدة.</p></div></div>
        <Link className="mobile-home-search" href="/search"><StoreIcon name="search" size={22}/><span>ابحث عن منتج...</span></Link>
        <HomeHeroCarousel/>
      </div>
    </section>
    <section className="features" aria-label="مميزات تغميسة">
      <svg className="features-paper-art" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true"><path className="features-paper-trail" d="M16 124c121-81 221 47 355-21 121-62 219 41 349-12 147-61 271 26 463-41"/><circle cx="16" cy="124" r="4"/><circle cx="1183" cy="50" r="4"/><g className="features-paper-citrus"><circle cx="85" cy="46" r="26"/><path d="M85 20v52M59 46h52M67 28l36 36m0-36L67 64"/></g><g className="features-paper-leaf"><path d="M1104 146c18-15 34-31 48-52m-30 32c-13 0-21-7-23-18 12-2 21 3 26 14m13-14c-1-12 6-20 17-23 3 12-2 21-13 26"/></g></svg>
      <div className="features-list">{features.map(({ icon, title, description }) => <article key={title} title={description}><span><StoreIcon name={icon} size={15}/></span><strong>{title}</strong></article>)}</div>
    </section>
    <section className="section category-section"><div className="section-title category-heading"><div><span>اختيارات لكل سفرة</span><h2>تصفح حسب الفئة</h2></div><p>اكتشف أطباقنا الطازجة واختر ما يناسب مناسبتك.</p></div><div className="category-grid">
      <Link className="category-card" href="/shop?category=مطبوخ"><span className="category-card-media"><Image src="/products/1.webp" alt="أطباق مطبوخة" fill sizes="(max-width: 767px) 50vw, 25vw"/></span><span className="category-card-body"><span><small>6 منتجات</small><strong>أطباق مطبوخة</strong></span><i aria-hidden="true">←</i></span></Link>
      <Link className="category-card" href="/shop?category=غموس"><span className="category-card-media"><Image src="/products/8.webp" alt="غموس وتغميسات" fill sizes="(max-width: 767px) 50vw, 25vw"/></span><span className="category-card-body"><span><small>2 منتجات</small><strong>غموس وتغميسات</strong></span><i aria-hidden="true">←</i></span></Link>
      <Link className="category-card" href="/shop?category=حلويات"><span className="category-card-media"><Image src="/products/7.webp" alt="حلويات" fill sizes="(max-width: 767px) 50vw, 25vw"/></span><span className="category-card-body"><span><small>1 منتج</small><strong>حلويات</strong></span><i aria-hidden="true">←</i></span></Link>
      <Link className="category-card" href="/shop?category=صوصات"><span className="category-card-media"><Image src="/products/9.webp" alt="صوصات" fill sizes="(max-width: 767px) 50vw, 25vw"/></span><span className="category-card-body"><span><small>2 منتجات</small><strong>صوصات</strong></span><i aria-hidden="true">←</i></span></Link>
    </div></section>
    <section className="section featured-section"><div className="section-title featured-heading"><div><span>الأكثر طلباً</span><h2>منتجات مميزة</h2></div><Link href="/shop">عرض كل المنتجات ←</Link></div><ProductGrid products={products.filter((product) => product.isFeatured)} variant="mobile-list"/></section>
  </>;
}
