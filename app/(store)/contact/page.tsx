import { FlavorIcon } from "@/components/shared/flavor-art";
import { ContactForm } from "@/domains/checkout/components/contact-form";

const contactItems = [
  { icon: "location", title: "الموقع", text: "المملكة العربية السعودية" },
  { icon: "phone", title: "واتساب", text: "+966 5X XXX XXXX", ltr: true },
  { icon: "mail", title: "البريد الإلكتروني", text: "hello@taghmesa.com", ltr: true },
  { icon: "clock", title: "ساعات العمل", text: "السبت – الخميس، 10ص – 10م" },
] as const;

export default function ContactPage() {
  return <main className="contact-page contact-page-focused">
    <header className="contact-hero-simple">
      <div>
        <span className="contact-kicker">تواصل معنا</span>
        <h1>كيف نقدر نساعدك؟</h1>
        <p>أرسل استفسارك أو ملاحظتك، وفريق تغميسة سيرد عليك بأسرع وقت.</p>
      </div>
    </header>
    <section className="contact-layout contact-layout-focused" aria-label="التواصل مع تغميسة">
      <ContactForm/>
      <aside className="contact-info contact-info-focused" aria-label="بيانات التواصل">
        <header><span>بيانات التواصل</span><h2>طرق أخرى للتواصل</h2><p>اختر الطريقة الأنسب لك، وسنكون سعداء بخدمتك.</p></header>
        <div className="contact-list">
          {contactItems.map((item) => <article key={item.title}><span><FlavorIcon name={item.icon}/></span><div><strong>{item.title}</strong><p dir={"ltr" in item && item.ltr ? "ltr" : undefined}>{item.text}</p></div></article>)}
        </div>
        <div className="contact-reply-note"><FlavorIcon name="clock"/><span><strong>وقت الرد</strong><small>عادةً خلال يوم عمل واحد</small></span></div>
      </aside>
    </section>
  </main>;
}
