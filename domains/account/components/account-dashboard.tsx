import Link from "next/link";
import { StoreIcon } from "@/components/shared/store-icon";
import type { Order, OrderStatus } from "@/domains/catalog/types";
import type { CustomerProfile } from "../repository";
import { ClaimPreviousOrder, ProfileForm } from "./account-actions";

const statusLabels: Record<OrderStatus, string> = { new: "تم استلام الطلب", preparing: "قيد التحضير", out_for_delivery: "في الطريق إليك", delivered: "تم التوصيل", cancelled: "ملغي" };
const statusStep: Record<OrderStatus, number> = { new: 1, preparing: 2, out_for_delivery: 3, delivered: 4, cancelled: 0 };

function OrderCard({ order }: { order: Order }) {
  const currentStep = statusStep[order.status];
  return <article className={`customer-order-card status-${order.status}`}>
    <header><div><small>طلب رقم</small><strong dir="ltr">#{order.orderNumber}</strong></div><span>{statusLabels[order.status]}</span></header>
    {order.status !== "cancelled" && <div className="customer-order-progress" aria-label={`حالة الطلب: ${statusLabels[order.status]}`}>{["استلمناه", "نحضّره", "في الطريق", "وصلك"].map((label, index) => <span key={label} className={index < currentStep ? "done" : ""}><i>{index < currentStep ? "✓" : index + 1}</i><small>{label}</small></span>)}</div>}
    <div className="customer-order-summary"><span><StoreIcon name="clock" size={16}/>{new Date(order.createdAt).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}</span><span>{order.items.length} منتجات</span><strong>{order.total.toFixed(2)} ر.س</strong></div>
    <details><summary>عرض تفاصيل الطلب <span aria-hidden="true">⌄</span></summary><div className="customer-order-details"><ul>{order.items.map((item) => <li key={item.id ?? `${item.productName}-${item.sizeLabel}`}><span>{item.productName}<small>{item.sizeLabel} × {item.quantity}</small></span><b>{(item.unitPrice * item.quantity).toFixed(2)} ر.س</b></li>)}</ul><div><span><StoreIcon name="pin" size={16}/>{order.city} — {order.address}</span>{order.notes && <p>{order.notes}</p>}</div></div></details>
  </article>;
}

function PanelHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <header className="account-panel-heading"><div><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div></header>;
}

export function AccountOrdersPanel({ orders }: { orders: Order[] }) {
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  return <section className="account-panel"><PanelHeading eyebrow="يتحضّر لك الآن" title="طلباتك الحالية" text="تابع حالة الطلب من لحظة استلامه وحتى وصوله إلى سفرتك."/>{activeOrders.length ? <div className="customer-orders-list">{activeOrders.map((order) => <OrderCard key={order.id} order={order}/>)}</div> : <div className="account-empty"><svg viewBox="0 0 120 90" aria-hidden="true"><path d="M19 35h70v42H19zM89 47h14l10 12v18H89zM36 35V20h35v15"/><circle cx="39" cy="78" r="8"/><circle cx="94" cy="78" r="8"/><path d="M47 21c8-8 19-8 27 0"/></svg><h3>لا يوجد طلب في الطريق</h3><p>اختر نكهتك المفضلة، ونحن نهتم بالباقي.</p><Link href="/shop">تسوّق الآن <span aria-hidden="true">←</span></Link></div>}</section>;
}

export function AccountHistoryPanel({ orders }: { orders: Order[] }) {
  const previousOrders = orders.filter((order) => ["delivered", "cancelled"].includes(order.status));
  return <section className="account-panel"><PanelHeading eyebrow="ذكريات لذيذة" title="سجل الطلبات" text="كل طلباتك المكتملة والملغاة محفوظة هنا للرجوع إليها."/>{previousOrders.length ? <div className="customer-orders-list">{previousOrders.map((order) => <OrderCard key={order.id} order={order}/>)}</div> : <div className="account-empty compact"><h3>سجلّك ما زال فارغاً</h3><p>ستظهر هنا طلباتك السابقة بعد اكتمالها.</p></div>}<div className="account-claim"><div><strong>طلبت قبل إنشاء حسابك؟</strong><p>أدخل رقم الطلب والجوال المستخدم وسنضيفه إلى سجلك.</p></div><ClaimPreviousOrder/></div></section>;
}

export function AccountProfilePanel({ profile }: { profile: CustomerProfile | null }) {
  const defaults = profile ?? { firstName: "", lastName: "", phone: "", city: "", address: "" };
  return <section className="account-panel account-profile-section"><PanelHeading eyebrow="طلب أسرع في المرة القادمة" title="بياناتي المحفوظة" text="نملأ هذه البيانات تلقائياً عند الطلب، ويمكنك تعديلها في أي وقت."/><ProfileForm profile={defaults}/></section>;
}
