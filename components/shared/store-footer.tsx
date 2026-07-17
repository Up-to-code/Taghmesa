import Link from "next/link";
import { FlavorScene } from "./flavor-art";

export function StoreFooter() {
  return <footer className="footer"><FlavorScene scene="footer"/><div className="footer-grid">
    <div className="footer-brand"><strong>تغميسة</strong><p>نكهات أصيلة محضّرة بعناية وحب للمشاركة في كل مناسبة.</p></div>
    <div><strong>روابط سريعة</strong><Link href="/">الرئيسية</Link><Link href="/shop">المتجر</Link><Link href="/about">من نحن</Link><Link href="/contact">تواصل معنا</Link></div>
    <div><strong>المنتجات</strong><Link href="/shop?category=مطبوخ">أطباق مطبوخة</Link><Link href="/shop?category=غموس">غموس وتغميسات</Link><Link href="/shop?category=حلويات">حلويات</Link><Link href="/shop?category=صوصات">صوصات</Link></div>
    <div><strong>السياسات</strong><Link href="/policies?section=delivery">سياسة التوصيل</Link><Link href="/policies?section=returns">سياسة الإرجاع</Link><Link href="/policies?section=privacy">الخصوصية</Link><Link href="/policies?section=terms">الشروط والأحكام</Link></div>
  </div><div className="footer-bottom"><span>© 2026 <b>تغميسة</b> — جميع الحقوق محفوظة</span><span>السعرات التقريبية قد تختلف حسب طريقة التحضير</span></div></footer>;
}
