import Link from "next/link";
import { PolicyHeroArt, PolicyIcon, type PolicyIconName } from "./policy-art";

export const policySections = [
  {
    id: "delivery",
    icon: "delivery",
    short: "توصيل طازج وفي الموعد",
    title: "سياسة التوصيل",
    intro: "نسعى لإيصال منتجاتك الطازجة بأسرع وقت ممكن وبأفضل حالة.",
    highlights: [{ value: "2–4", label: "ساعات داخل المدينة" }, { value: "+100", label: "ريال للتوصيل المجاني" }],
    groups: [
      { title: "مواعيد التوصيل", note: "متى يصلك الطلب؟", items: ["الطلبات داخل المدينة: خلال 2-4 ساعات", "الطلبات بين المدن: 1-3 أيام عمل", "أوقات العمل: السبت – الخميس، 10ص – 9م", "الجمعة: 2م – 9م فقط"] },
      { title: "رسوم التوصيل", note: "رسوم واضحة بلا مفاجآت", items: ["توصيل مجاني للطلبات فوق 100 ريال", "طلبات أقل من 100 ريال: رسوم توصيل 15 ريال", "التوصيل السريع: 25 ريال إضافية"] },
    ],
  },
  {
    id: "returns",
    icon: "returns",
    short: "رضاك أولويتنا دائماً",
    title: "سياسة الإرجاع",
    intro: "رضاك هو أولويتنا. إذا لم تكن راضياً عن أي منتج، نحن هنا لمساعدتك.",
    highlights: [{ value: "24", label: "ساعة لطلب الإرجاع" }, { value: "3–5", label: "أيام لاسترداد المبلغ" }],
    groups: [
      { title: "حالات مقبولة", note: "متى نقبل الإرجاع؟", items: ["المنتج تالف أو مكسور عند الاستلام", "المنتج لا يطابق الوصف أو الطلب", "خطأ في الطلب من جانبنا"] },
      { title: "إجراءات الإرجاع", note: "ثلاث خطوات بسيطة", items: ["التواصل معنا خلال 24 ساعة من الاستلام", "إرسال صورة للمنتج عبر واتساب", "استرداد المبلغ خلال 3-5 أيام عمل"] },
    ],
  },
  {
    id: "privacy",
    icon: "privacy",
    short: "بياناتك في أمان",
    title: "سياسة الخصوصية",
    intro: "نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.",
    highlights: [{ value: "SSL", label: "تشفير آمن للبيانات" }, { value: "0", label: "بيانات دفع نخزنها" }],
    groups: [
      { title: "المعلومات التي نجمعها", note: "الحد الأدنى لخدمتك", items: ["الاسم ورقم الجوال وعنوان التوصيل", "البريد الإلكتروني للتواصل والفواتير", "تاريخ الطلبات لتحسين الخدمة"] },
      { title: "كيف نحمي بياناتك", note: "خصوصيتك جزء من ثقتك", items: ["لا نبيع أو نشارك بياناتك مع أي طرف ثالث", "بياناتك محمية بتشفير SSL", "لا نحتفظ ببيانات بطاقتك الائتمانية"] },
    ],
  },
  {
    id: "terms",
    icon: "terms",
    short: "اتفاق واضح وبسيط",
    title: "الشروط والأحكام",
    intro: "باستخدامك لمتجر تغميسة فأنت توافق على هذه الشروط والأحكام.",
    highlights: [{ value: "+18", label: "العمر المطلوب للطلب" }, { value: "VAT", label: "الأسعار شاملة الضريبة" }],
    groups: [
      { title: "شروط الطلب", note: "قبل تأكيد طلبك", items: ["يجب أن يكون عمرك 18 عاماً أو أكثر", "الأسعار قابلة للتغيير دون إشعار مسبق", "السعرات الحرارية تقديرية وقد تختلف"] },
      { title: "الدفع والفواتير", note: "طريقة الدفع الحالية", items: ["جميع الأسعار بالريال السعودي شاملة ضريبة القيمة المضافة", "الدفع عند الاستلام هو وسيلة الدفع المتاحة حالياً", "لا تُجمع أو تُخزن بيانات بطاقات دفع"] },
    ],
  },
] as const satisfies ReadonlyArray<{ id: string; icon: PolicyIconName; short: string; title: string; intro: string; highlights: ReadonlyArray<{ value: string; label: string }>; groups: ReadonlyArray<{ title: string; note: string; items: readonly string[] }> }>;

type PolicySectionId = (typeof policySections)[number]["id"];

export function PoliciesView({ activeSection }: { activeSection: PolicySectionId }) {
  const policy = policySections.find(({ id }) => id === activeSection) ?? policySections[0];

  return <main className="policies-page">
    <section className="policies-hero">
      <div className="policies-hero-copy">
        <span className="policies-kicker"><i aria-hidden="true"/> لأن الوضوح جزء من الثقة</span>
        <h1>كل شيء واضح،<br/><em>قبل الطلب</em></h1>
        <p>جمعنا لك سياسات تغميسة بلغة بسيطة وواضحة، لتعرف كل التفاصيل من التوصيل إلى الخصوصية.</p>
        <span className="policies-updated"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>آخر تحديث: يناير 2025</span>
      </div>
      <div className="policies-hero-visual"><PolicyHeroArt/><span>واضحة وبسيطة</span></div>
    </section>

    <section className="policies-shell">
      <header className="policies-heading"><div><span>اختر ما تبحث عنه</span><h2>سياسات تحفظ حقك</h2></div><p>انتقل مباشرةً إلى السياسة التي تهمك.</p></header>
      <nav className="policies-tabs" aria-label="أقسام السياسات">
        {policySections.map((item, index) => <Link key={item.id} href={`/policies?section=${item.id}`} aria-current={item.id === activeSection ? "page" : undefined} className={item.id === activeSection ? "active" : ""}>
          <small>{String(index + 1).padStart(2, "0")}</small><span><PolicyIcon name={item.icon}/></span><strong>{item.title}</strong><em>{item.short}</em>
        </Link>)}
      </nav>

      <div className="policy-layout">
        <article className="policy-document">
          <header><span className="policy-document-icon"><PolicyIcon name={policy.icon}/></span><div><small>سياسة تغميسة</small><h2>{policy.title}</h2><p>{policy.intro}</p></div></header>
          <div className="policy-groups">
            {policy.groups.map((group, groupIndex) => <section key={group.title}>
              <header><span>{String(groupIndex + 1).padStart(2, "0")}</span><div><h3>{group.title}</h3><p>{group.note}</p></div></header>
              <ul>{group.items.map((item) => <li key={item}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 2.7 2.8L16 9"/></svg><span>{item}</span></li>)}</ul>
            </section>)}
          </div>
        </article>

        <aside className="policy-summary">
          <span className="policy-summary-label">مختصر السياسة</span>
          <h3>أهم ما تحتاج معرفته</h3>
          <div className="policy-highlights">{policy.highlights.map((highlight) => <article key={highlight.label}><strong dir="ltr">{highlight.value}</strong><span>{highlight.label}</span></article>)}</div>
          <div className="policy-help"><span>لديك سؤال آخر؟</span><p>فريقنا جاهز لمساعدتك وتوضيح أي تفصيل.</p><Link href="/contact">تواصل معنا <span aria-hidden="true">←</span></Link></div>
        </aside>
      </div>
    </section>

  </main>;
}
