import type { Metadata } from "next";
import { CheckoutArt } from "@/domains/checkout/components/checkout-art";
import { CheckoutForm } from "@/domains/checkout/components/checkout-form";
import { getCustomerProfile } from "@/domains/account/repository";
import { getCurrentSession } from "@/lib/auth/server";

export const metadata: Metadata = { title: "إتمام الطلب — تغميسة" };

export default async function CheckoutPage() {
  const session = await getCurrentSession();
  const profile = session ? await getCustomerProfile(session.user.id) : null;
  const nameParts = session?.user.name.trim().split(/\s+/) ?? [];
  const defaults = {
    firstName: profile?.firstName || nameParts[0] || "",
    lastName: profile?.lastName || nameParts.slice(1).join(" "),
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    address: profile?.address ?? "",
  };

  return <div className="checkout-page-shell">
    <section className="checkout-hero">
      <div className="checkout-hero-copy"><span>باقي خطوة واحدة</span><h1>نكهاتك في طريقها<br/>إلى سفرتك</h1><p>أدخل عنوان التوصيل وأكمل كضيف، أو سجّل الدخول بشكل اختياري لتحفظ الطلب في حسابك.</p><div className="checkout-steps" aria-label="خطوات إتمام الطلب"><span className="active"><i>١</i>التوصيل</span><b/><span><i>٢</i>التأكيد</span><b/><span><i>٣</i>تم الطلب</span></div></div>
      <div className="checkout-hero-art"><CheckoutArt/></div>
    </section>
    <section className="checkout-page"><CheckoutForm defaults={defaults} isAuthenticated={Boolean(session)}/></section>
  </div>;
}
