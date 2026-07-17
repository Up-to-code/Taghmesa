import Image from "next/image";
import Link from "next/link";
import { FlavorIcon, FlavorScene } from "@/components/shared/flavor-art";

const values = [
  { icon: "leaf", title: "طازج دائماً", text: "مكونات نختارها يومياً بعناية لتصل إلى سفرتكم بأفضل نكهة." },
  { icon: "sparkle", title: "طبيعي 100%", text: "وصفات واضحة بلا مواد حافظة أو إضافات لا تحتاجها النكهة." },
  { icon: "handmade", title: "صنع يدوي", text: "كل طبق يمرّ بيد تهتم بالتفاصيل الصغيرة قبل الكبيرة." },
  { icon: "share", title: "للمشاركة", text: "نصنع طعاماً يفتح الحديث ويجمع الأحباب حول سفرة واحدة." },
  { icon: "quality", title: "جودة عالية", text: "معيار ثابت في المكونات والتحضير والتقديم، في كل طلب." },
] as const;

const stats = [
  { value: "2023", count: 2023, suffix: "", label: "سنة التأسيس", note: "بداية الحكاية" },
  { value: "11+", count: 11, suffix: "+", label: "منتج متاح", note: "لكل سفرة اختيار" },
  { value: "100%", count: 100, suffix: "%", label: "مكونات طبيعية", note: "بلا إضافات مصنّعة" },
  { value: "يدوي", count: null, suffix: "", label: "صنع يدوي بالكامل", note: "عناية في كل دفعة" },
] as const;

export default function AboutPage() {
  return <div className="about-page">
    <section className="about-hero">
      <FlavorScene scene="story"/>
      <div className="about-hero-copy">
        <span className="page-hero-kicker">من مطبخنا إلى سفرتكم</span>
        <h1>قصة بدأت<br/><em>من سفرة</em></h1>
        <svg className="about-title-swash" viewBox="0 0 280 26" preserveAspectRatio="none" aria-hidden="true"><path d="M7 13c65 10 166 7 266-4"/><path d="M42 18c62 4 138 2 205-3"/></svg>
        <p>علامة سعودية تصنع نكهات بيتية طازجة، محضّرة بحب لتُشارك في اللحظات التي تستحق.</p>
        <div className="about-hero-actions"><Link href="/shop">اكتشف منتجاتنا <span aria-hidden="true">←</span></Link><Link href="/contact">تواصل معنا</Link></div>
      </div>
    </section>
    <section className="about-story">
      <div className="about-story-media"><Image src="/products/9.webp" alt="تعتيمة تغميسة" fill sizes="(max-width: 900px) 100vw, 52vw"/><FlavorScene scene="story"/><div className="about-image-caption"><small>من وصفات تغميسة</small><strong>نكهة تُحضّر لتُشارك</strong></div></div>
      <article><span className="story-kicker">قصتنا</span><h2>نكهة البيت،<br/>ببساطة</h2><p>بدأت تغميسة عام 2023 بفكرة واضحة: طعام بيتي طازج يجمع الناس حول مائدة واحدة.</p><p>نحضّر كل منتج يدوياً من مكونات طبيعية، ونحافظ على النكهة الأصيلة في كل طلب.</p><blockquote>“نريد لكل لقمة أن تحمل دفء المطبخ، وفرحة السفرة.”</blockquote></article>
    </section>
    <section className="about-stats" aria-label="تغميسة بالأرقام"><header><span>رحلتنا حتى الآن</span><h2>أرقام صغيرة، أثر كبير</h2></header><div>{stats.map((stat) => <article key={stat.label}><strong data-count={stat.count ?? undefined} data-suffix={stat.suffix} dir={stat.count === null ? undefined : "ltr"}>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small></article>)}</div></section>
    <section className="about-values"><div className="about-values-heading"><span>ما نؤمن به</span><h2>قيم تظهر في كل طبق</h2><p>ليست شعارات على الورق؛ هي الطريقة التي نختار ونحضّر ونقدّم بها كل طلب.</p></div><div className="about-values-grid">{values.map((value, index) => <article key={value.title}><small>{String(index + 1).padStart(2, "0")}</small><span><FlavorIcon name={value.icon}/></span><strong>{value.title}</strong><p>{value.text}</p></article>)}</div></section>
  </div>;
}
