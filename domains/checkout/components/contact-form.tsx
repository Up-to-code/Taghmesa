"use client";

import { useState, type FormEvent } from "react";
import { StoreIcon } from "@/components/shared/store-icon";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSent(true); window.setTimeout(() => setSent(false), 4500);
  }
  return <form className="contact-form" onSubmit={submit}>
    <header className="contact-form-heading"><span>نموذج التواصل</span><h2>أرسل رسالتك</h2><p>اكتب التفاصيل الأساسية فقط، وسنتواصل معك في أقرب وقت.</p></header>
    <div className="form-row">
      <label><span>الاسم</span><input required name="name" autoComplete="name" placeholder="اسمك الكريم"/></label>
      <label><span>رقم الجوال</span><input required name="phone" autoComplete="tel" inputMode="tel" dir="ltr" placeholder="05X XXX XXXX"/></label>
    </div>
    <label><span>البريد الإلكتروني</span><input required type="email" name="email" autoComplete="email" dir="ltr" placeholder="name@example.com"/></label>
    <label><span>الموضوع</span><select name="subject" defaultValue="استفسار عام"><option>استفسار عام</option><option>استفسار عن طلب</option><option>اقتراح أو ملاحظة</option></select></label>
    <label><span>رسالتك</span><textarea required name="message" rows={5} placeholder="كيف نقدر نساعدك؟"/></label>
    <button className="contact-submit" type="submit"><span>إرسال الرسالة</span><StoreIcon name="send" size={18}/></button>
    {sent && <p className="form-success" role="status"><StoreIcon name="check" size={17}/><span>تم إرسال رسالتك! سنتواصل معك قريباً. (عرض تجريبي)</span></p>}
  </form>;
}
