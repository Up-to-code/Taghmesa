import Link from "next/link";
import { notFound } from "next/navigation";
import { loadStoreProductWithRecommendations } from "@/domains/catalog/load-products";
import { ProductDetailsActions } from "@/domains/catalog/components/product-details-actions";
import { ProductImageGallery } from "@/domains/catalog/components/product-image-gallery";
import { ProductFlavorStamp } from "@/domains/catalog/components/catalog-flavor-art";
import { ProductGrid } from "@/domains/catalog/components/product-grid";

export const dynamic = "force-dynamic";

function DetailIcon({ name }: { name: "heat" | "clock" | "heart" }) {
  if (name === "heat") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 4c2 6-3 8-1 13 1-4 5-5 6-9 4 4 6 8 5 12-1 6-6 9-12 9S5 26 5 20c0-5 3-9 8-13-1 5 1 7 2 9 0-5 5-7 3-12Z"/></svg>;
  if (name === "clock") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="17" r="11"/><path d="M16 10v7l5 3M11 4h10"/></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27S5 21 5 13c0-7 8-9 11-3 3-6 11-4 11 3 0 8-11 14-11 14Z"/></svg>;
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) notFound();
  const { product, recommendations } = await loadStoreProductWithRecommendations(productId);
  if (!product) notFound();

  return <div className="product-detail-page">
    <nav className="product-breadcrumb" aria-label="مسار التنقل"><Link href="/">الرئيسية</Link><span>›</span><Link href="/shop">المتجر</Link><span>›</span><strong>{product.nameAr}</strong></nav>
    <section className="product-detail">
      <ProductImageGallery imageUrl={product.imageUrl} name={product.nameAr} emoji={product.emoji} category={product.category} isNew={product.isNew}/>
      <article className="detail-copy">
        <p className="detail-kicker">TAGHMESA · DIPS & MORE</p>
        <div className="detail-title-row"><ProductFlavorStamp category={product.category}/><div><h1>{product.nameAr}</h1><svg className="detail-title-swash" viewBox="0 0 280 22" preserveAspectRatio="none" aria-hidden="true"><path d="M6 12c69 8 150 9 268-3"/><path d="M86 18c48 2 97 0 143-4"/></svg></div></div>
        <p className="detail-en">{product.nameEn}</p>
        <p className="detail-description">{product.description}</p>
        <div className="detail-flavor-tags" aria-label="مميزات المنتج"><span>طازج يومياً</span><span>صنع يدوي</span><span>للمشاركة</span></div>
        <ProductDetailsActions product={product}/>
        <div className="detail-promises"><span>✓ محضّر حسب الطلب</span><span>✓ مكونات طبيعية</span><span>✓ الدفع عند الاستلام</span></div>
      </article>
    </section>
    <section className="detail-notes">
      <svg className="detail-notes-backdrop" viewBox="0 0 1200 190" preserveAspectRatio="none" aria-hidden="true"><path d="M18 144c124-93 224 55 357-24 117-69 222 52 344-19 129-75 251 51 463-42"/><circle cx="18" cy="144" r="5"/><circle cx="1182" cy="59" r="5"/><path d="M1112 18c-21 18-35 40-43 67m15-38c12-2 20-9 23-21-13-1-22 5-26 16m-12 24c-13 0-22-7-26-19 14-2 24 4 29 15"/></svg>
      <header><span>كل ما تحتاج معرفته</span><h2>من مطبخنا إلى سفرتكم</h2></header>
      <div>
        <article><svg className="detail-note-doodle" viewBox="0 0 120 90" aria-hidden="true"><path d="M28 78c-8-21 10-31 6-50 12 10 8 20 14 27 0-15 11-21 14-36 18 17 24 38 9 59M17 78h72"/><path d="M74 26c7 9 8 19 4 29"/></svg><span><DetailIcon name="heat"/></span><div><strong>السعرات</strong><p>السعرات تقريبية وقد تختلف حسب الحجم وطريقة التحضير.</p></div><small className="detail-note-index">01 · نعرفكم بالطبق</small></article>
        <article><svg className="detail-note-doodle" viewBox="0 0 120 90" aria-hidden="true"><circle cx="39" cy="52" r="27"/><path d="M39 25v54M12 52h54M20 33l38 38M58 33 20 71"/><circle cx="39" cy="52" r="4"/></svg><span><DetailIcon name="clock"/></span><div><strong>الحفظ والتقديم</strong><p>يحفظ مبرداً ويُفضّل استهلاكه طازجاً للحصول على أفضل نكهة.</p></div><small className="detail-note-index">02 · نكهة تدوم</small></article>
        <article><svg className="detail-note-doodle" viewBox="0 0 120 90" aria-hidden="true"><path d="M13 79c24-18 45-37 68-68M32 62C17 61 10 53 12 41c15-1 24 6 24 17m17-16c-1-15 7-25 21-28 4 14-1 25-15 31m18-23c7-7 16-8 25-3-5 10-13 14-24 10"/></svg><span><DetailIcon name="heart"/></span><div><strong>صُنع بعناية</strong><p>يُحضّر كل طلب بعناية وبمكونات مختارة للمشاركة مع من تحب.</p></div><small className="detail-note-index">03 · بيدٍ أمينة</small></article>
      </div>
    </section>
    {recommendations.length > 0 && <section className="product-recommendations">
      <header><div><span>من نفس النكهات</span><h2>قد يعجبك أيضاً</h2></div><Link href={`/shop?category=${encodeURIComponent(product.category)}`}>عرض الفئة كاملة ←</Link></header>
      <ProductGrid products={recommendations}/>
    </section>}
  </div>;
}
