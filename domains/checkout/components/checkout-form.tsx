"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { StoreIcon } from "@/components/shared/store-icon";
import { useCart, type CartItem } from "@/domains/cart/cart-context";
import { logger } from "@/lib/logger";

type CheckoutDefaults = { firstName: string; lastName: string; phone: string; city: string; address: string };
type OrderResponse = { orderNumber?: string; error?: string };
type CouponResponse = { code?: string; discount?: number; description?: string; error?: string };

function CheckoutAccountOption({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) return <section className="checkout-account-option is-signed-in">
    <span className="checkout-account-icon"><StoreIcon name="check" size={19}/></span>
    <div><small>أنت مسجّل الدخول</small><strong>طلبك سيظهر تلقائياً في حسابك</strong><p>سنحفظ بيانات التوصيل لتكون طلباتك القادمة أسرع.</p></div>
    <Link href="/account">حسابي</Link>
  </section>;

  return <section className="checkout-account-option">
    <span className="checkout-account-icon"><StoreIcon name="user" size={20}/></span>
    <div className="checkout-account-copy"><span><small>اختياري تماماً</small><strong>لديك حساب؟</strong></span><p>سجّل الدخول لتتبع طلبك وحفظه في السجل والحصول على عروض ورموز خصم. أو أكمل كضيف بدون أي خطوة إضافية.</p><ul><li><StoreIcon name="clock" size={14}/>تتبع وسجل الطلبات</li><li><StoreIcon name="award" size={14}/>عروض الأعضاء</li></ul></div>
    <div className="checkout-account-actions"><Link href="/login?next=/checkout">تسجيل الدخول</Link><Link href="/register?next=/checkout">إنشاء حساب</Link><span>أو أكمل كضيف ↓</span></div>
  </section>;
}

function OrderSummary({ items, total, discount, couponCode, couponMessage, couponLoading, submitting, onCouponChange, onApplyCoupon }: {
  items: CartItem[];
  total: number;
  discount: number;
  couponCode: string;
  couponMessage: string;
  couponLoading: boolean;
  submitting: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
}) {
  return <aside className="order-summary checkout-panel">
    <header className="checkout-panel-heading"><span>طلبك</span><div><small>{items.reduce((sum, item) => sum + item.quantity, 0)} منتجات</small><h2>ملخص الطلب</h2></div></header>
    <div className="checkout-summary-items">{items.map((item) => <article key={item.key}><div className="summary-thumb">{item.imageUrl ? <Image src={item.imageUrl} alt="" width={54} height={54}/> : item.emoji}</div><div><strong>{item.nameAr}</strong><small>{item.sizeLabel} × {item.quantity}</small></div><b>{(item.price * item.quantity).toFixed(2)} ر.س</b></article>)}</div>
    <div className="checkout-coupon">
      <label htmlFor="checkout-coupon-code">رمز الخصم</label>
      <div><input id="checkout-coupon-code" value={couponCode} onChange={(event) => onCouponChange(event.target.value)} placeholder="WELCOME10" dir="ltr" maxLength={40}/><button type="button" disabled={!couponCode.trim() || couponLoading} onClick={onApplyCoupon}>{couponLoading ? "..." : "تطبيق"}</button></div>
      {couponMessage && <p className={discount > 0 ? "is-valid" : "is-error"}>{couponMessage}</p>}
    </div>
    <div className="summary-total"><span>المجموع الفرعي</span><b>{total.toFixed(2)} ر.س</b>{discount > 0 && <><span>الخصم</span><b className="checkout-discount">− {discount.toFixed(2)} ر.س</b></>}<span>التوصيل</span><b className="checkout-free">مجاني</b><strong>الإجمالي</strong><strong>{Math.max(0, total - discount).toFixed(2)} ر.س</strong></div>
    <button disabled={submitting} className="primary-button checkout-submit" type="submit">{submitting ? <><span className="checkout-spinner"/>جاري تأكيد الطلب...</> : <>تأكيد الطلب <StoreIcon name="arrow-left" size={18}/></>}</button>
    <p className="checkout-secure-note"><StoreIcon name="lock" size={14}/>لن تحتاج إلى إنشاء حساب لإتمام الطلب</p>
  </aside>;
}

export function CheckoutForm({ defaults, isAuthenticated = false }: { defaults?: CheckoutDefaults; isAuthenticated?: boolean }) {
  const router = useRouter();
  const { items, total, clear, showToast, ready } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  function changeCoupon(value: string) {
    setCouponCode(value.toUpperCase());
    setAppliedCoupon("");
    setDiscount(0);
    setCouponMessage("");
  }

  async function applyCoupon() {
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: total }),
      });
      const data = await response.json() as CouponResponse;
      if (!response.ok || !data.code || typeof data.discount !== "number") throw new Error(data.error ?? "تعذّر تطبيق الرمز");
      setAppliedCoupon(data.code);
      setCouponCode(data.code);
      setDiscount(data.discount);
      setCouponMessage(data.description || `تم تطبيق خصم ${data.discount.toFixed(2)} ر.س`);
    } catch (caught) {
      setAppliedCoupon("");
      setDiscount(0);
      setCouponMessage(caught instanceof Error ? caught.message : "تعذّر تطبيق الرمز");
    } finally {
      setCouponLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
        firstName: form.get("firstName"), lastName: form.get("lastName"), phone: form.get("phone"), city: form.get("city"), address: form.get("address"), notes: form.get("notes"), couponCode: appliedCoupon, paymentMethod: "cod",
        items: items.map((item) => ({ productId: item.productId, sizeId: item.sizeId, quantity: item.quantity })),
      }) });
      const data = await response.json() as OrderResponse;
      if (!response.ok || !data.orderNumber) throw new Error(data.error ?? "تعذّر إرسال الطلب");
      clear();
      showToast("تم تأكيد طلبك بنجاح! 🎉");
      router.push(`/checkout/thank-you?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "تعذّر إرسال الطلب";
      logger.error("checkout.submit_failed", { error: String(caught) });
      setError(message);
      showToast(message);
      setSubmitting(false);
    }
  }

  if (!ready) return <div className="checkout-cart-loading" aria-label="جاري تجهيز سلة الطلب"><span/><span/><span/></div>;
  if (!items.length) return <div className="empty-checkout"><span><StoreIcon name="cart" size={34}/></span><h2>سلتك فارغة</h2><p>أضف بعض المنتجات قبل إتمام الطلب.</p><Link className="primary-button" href="/shop">تصفح المنتجات</Link></div>;

  return <form className="checkout-layout" onSubmit={submit}>
    <div className="checkout-main">
      <CheckoutAccountOption isAuthenticated={isAuthenticated}/>
      <section className="checkout-form checkout-panel">
        <header className="checkout-panel-heading"><span>١</span><div><small>مكان وصول الطلب</small><h2>بيانات التوصيل</h2></div></header>
        {isAuthenticated && <p className="checkout-saved-note"><StoreIcon name="check" size={15}/>عبّأنا بياناتك المحفوظة ويمكنك تعديلها لهذا الطلب.</p>}
        <div className="form-row"><label><span>الاسم الأول</span><input required name="firstName" autoComplete="given-name" maxLength={80} defaultValue={defaults?.firstName}/></label><label><span>اسم العائلة</span><input required name="lastName" autoComplete="family-name" maxLength={80} defaultValue={defaults?.lastName}/></label></div>
        <div className="form-row"><label><span>رقم الجوال</span><input required name="phone" autoComplete="tel" inputMode="tel" minLength={7} maxLength={20} dir="ltr" defaultValue={defaults?.phone}/></label><label><span>المدينة</span><input required name="city" autoComplete="address-level2" maxLength={80} defaultValue={defaults?.city}/></label></div>
        <label><span>العنوان بالتفصيل</span><textarea required name="address" autoComplete="street-address" minLength={3} maxLength={1000} rows={3} defaultValue={defaults?.address}/></label>
        <label><span>ملاحظات الطلب <small>اختياري</small></span><textarea name="notes" maxLength={2000} rows={3} placeholder="مثال: اتصل عند الوصول"/></label>
      </section>
      <section className="checkout-payment checkout-panel">
        <header className="checkout-panel-heading"><span>٢</span><div><small>ادفع بالطريقة المناسبة</small><h2>طريقة الدفع</h2></div></header>
        <div className="payment-options" role="radiogroup" aria-label="طريقة الدفع"><div className="selected" role="radio" aria-checked="true"><span>💵</span><strong>عند الاستلام</strong><small><StoreIcon name="check" size={12}/>متاح</small></div><div aria-disabled="true"><span>💳</span><strong>بطاقة</strong><small>قريباً</small></div><div aria-disabled="true"><span></span><strong>Apple Pay</strong><small>قريباً</small></div></div>
      </section>
      {error && <p className="checkout-error" role="alert">{error}</p>}
    </div>
    <OrderSummary items={items} total={total} discount={discount} couponCode={couponCode} couponMessage={couponMessage} couponLoading={couponLoading} submitting={submitting} onCouponChange={changeCoupon} onApplyCoupon={applyCoupon}/>
  </form>;
}
