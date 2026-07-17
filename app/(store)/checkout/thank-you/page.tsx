import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StoreIcon } from "@/components/shared/store-icon";
import { CheckoutArt } from "@/domains/checkout/components/checkout-art";
import { getCurrentSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: "شكراً لطلبك — تغميسة" };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const orderNumber = (await searchParams).order?.trim();
  if (!orderNumber || !/^TG-[A-Z0-9-]{4,20}$/i.test(orderNumber)) redirect("/shop");
  const session = await getCurrentSession();
  const claimPath = `/account?claim=${encodeURIComponent(orderNumber)}`;
  const loginHref = `/login?next=${encodeURIComponent(claimPath)}`;
  const registerHref = `/register?next=${encodeURIComponent(claimPath)}`;

  return <main className="thank-you-page">
    <section className="thank-you-card">
      <div className="thank-you-art"><CheckoutArt variant="success"/></div>
      <div className="thank-you-copy"><span className="thank-you-kicker"><StoreIcon name="check" size={15}/>تم تأكيد الطلب</span><h1>شكراً لك،<br/>بدأت الحكاية اللذيذة</h1><p>استلمنا طلبك وسيتواصل معك فريق تغميسة عند بدء التوصيل.</p><div className="thank-you-order"><span>رقم طلبك</span><strong dir="ltr">#{orderNumber}</strong><small>احتفظ بالرقم للرجوع إلى طلبك</small></div></div>
    </section>

    <section className="thank-you-next"><header><span>ماذا سيحدث الآن؟</span><h2>من مطبخنا إلى بابك</h2></header><div><article><i>١</i><strong>نراجع الطلب</strong><p>نتأكد من التفاصيل والعنوان.</p></article><article><i>٢</i><strong>نحضّره بعناية</strong><p>يبدأ المطبخ بتجهيز نكهاتك.</p></article><article><i>٣</i><strong>ننطلق إليك</strong><p>نتواصل معك قبل الوصول.</p></article></div></section>

    {session ? <section className="thank-you-account is-signed-in"><span><StoreIcon name="user" size={24}/></span><div><small>محفوظ في حسابك</small><h2>تابع حالة طلبك في أي وقت</h2><p>ستجد هذا الطلب مع جميع تفاصيله في صفحة حسابك.</p></div><Link href="/account">متابعة الطلب <StoreIcon name="arrow-left" size={17}/></Link></section> : <section className="thank-you-account"><span><StoreIcon name="user" size={24}/></span><div><small>خطوة اختيارية</small><h2>هل تريد حفظ الطلب في حساب؟</h2><p>أنشئ حساباً أو سجّل الدخول لتتبع الطلب، الاحتفاظ بسجل طلباتك، واستلام عروض ورموز خصم. طلبك مؤكد حتى لو تخطيت هذه الخطوة.</p><ul><li><StoreIcon name="clock" size={14}/>تتبع الطلب</li><li><StoreIcon name="award" size={14}/>عروض الأعضاء</li><li><StoreIcon name="check" size={14}/>طلب أسرع لاحقاً</li></ul></div><div><Link href={registerHref}>إنشاء حساب</Link><Link href={loginHref}>لدي حساب</Link></div></section>}

    <div className="thank-you-actions"><Link href="/shop">العودة للمتجر</Link><Link href="/">الرئيسية</Link></div>
  </main>;
}
