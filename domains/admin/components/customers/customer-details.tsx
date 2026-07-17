"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleUserRound,
  Clock3,
  CreditCard,
  History,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  TicketPercent,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminCustomerDetails as CustomerDetailsType, AdminCustomerOrder } from "../../types";
import { CustomerStatusControl } from "./customer-status-control";
import { AdminPageHeader } from "../ui/admin-page-header";

const statusLabels: Record<string, { label: string; className: string }> = {
  new: { label: "طلب مستلم", className: "border-blue-200 bg-blue-50 text-blue-700" },
  preparing: { label: "قيد التحضير", className: "border-amber-200 bg-amber-50 text-amber-700" },
  out_for_delivery: { label: "قيد التوصيل", className: "border-violet-200 bg-violet-50 text-violet-700" },
  delivered: { label: "تم التسليم", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  cancelled: { label: "ملغي", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

function InfoTile({ icon: Icon, label, children, dir }: { icon: typeof Mail; label: string; children: React.ReactNode; dir?: "ltr" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-400"><Icon className="size-4 text-cyan-700" />{label}</span>
      <b className="block break-words text-sm text-slate-800" dir={dir}>{children}</b>
    </div>
  );
}

function OrderCard({ order }: { order: AdminCustomerOrder }) {
  const status = statusLabels[order.status] ?? { label: order.status, className: "border-slate-200 bg-slate-50 text-slate-700" };
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="gap-3 border-b sm:grid-cols-[1fr_auto]">
        <div>
          <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 font-black text-slate-900 hover:text-cyan-800">
            <ReceiptText className="size-4" /> #{order.orderNumber}
          </Link>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{new Date(order.createdAt).toLocaleString("ar-SA")}</span>
            <span className="flex items-center gap-1"><MapPin className="size-3.5" />{order.city}</span>
            <span className="flex items-center gap-1"><ShoppingBag className="size-3.5" />{itemCount.toLocaleString("ar-SA")} عناصر</span>
          </div>
        </div>
        <Badge variant="outline" className={`mt-1 h-7 px-3 ${status.className}`}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl bg-slate-50 p-2.5">
              <span className="grid size-12 place-items-center overflow-hidden rounded-xl border border-white bg-white text-slate-300">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="size-full object-cover" />
                ) : <Package className="size-5" />}
              </span>
              <span className="min-w-0"><b className="block truncate text-sm text-slate-800">{item.productName}</b><small className="text-slate-400">{item.sizeLabel} · {item.quantity.toLocaleString("ar-SA")} × {item.unitPrice.toFixed(2)} ر.س</small></span>
              <b className="text-sm text-cyan-800">{(item.unitPrice * item.quantity).toFixed(2)} ر.س</b>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><CreditCard className="size-4 text-cyan-700" />{order.paymentMethod === "cod" ? "الدفع عند الاستلام" : order.paymentMethod}<span className="text-slate-300">·</span>{order.address}{order.couponCode && <Badge variant="outline" className="border-emerald-100 bg-emerald-50 text-emerald-700"><TicketPercent />{order.couponCode} · خصم {order.discountAmount.toFixed(2)} ر.س</Badge>}</div>
          <div className="flex items-baseline gap-2"><span className="text-xs font-bold text-slate-400">الإجمالي</span><b className="text-xl text-cyan-800">{order.total.toFixed(2)} ر.س</b></div>
        </div>
        <Button asChild variant="outline" className="w-full shadow-none"><Link href={`/admin/orders/${order.id}`}>عرض كل تفاصيل الطلب <ArrowRight className="rotate-180" /></Link></Button>
      </CardContent>
    </Card>
  );
}

function EmptyOrders({ history = false }: { history?: boolean }) {
  return (
    <Card className="border-dashed py-14 text-center shadow-none"><CardContent>{history ? <History className="mx-auto mb-3 size-10 text-cyan-200" /> : <Clock3 className="mx-auto mb-3 size-10 text-cyan-200" />}<h3 className="font-black text-slate-800">{history ? "لا يوجد سجل طلبات بعد" : "لا توجد طلبات نشطة"}</h3><p className="mt-2 text-xs text-slate-400">{history ? "ستظهر الطلبات المكتملة والملغاة هنا." : "أي طلب جديد أو قيد التنفيذ سيظهر في هذه المساحة."}</p></CardContent></Card>
  );
}

export function CustomerDetails({ customer }: { customer: CustomerDetailsType }) {
  const couponOrders = [...customer.activeOrders, ...customer.orderHistory].filter((order) => order.couponCode);
  return (
    <>
      <Button asChild variant="ghost" className="mb-3 -mr-3 w-fit text-slate-500"><Link href="/admin/customers"><ArrowRight />العودة إلى العملاء</Link></Button>
      <AdminPageHeader
        eyebrow="ملف العميل"
        title={customer.name}
        description="بيانات الحساب والتواصل والعنوان، مع رحلة الطلبات النشطة وسجل المشتريات الكامل."
        action={<CustomerStatusControl customerId={customer.id} initiallyBanned={customer.isBanned} />}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-none"><CardContent><span className="flex items-center gap-2 text-xs font-bold text-slate-400"><ShoppingBag className="size-4 text-cyan-700" />إجمالي الطلبات</span><b className="mt-2 block text-2xl">{customer.orderCount.toLocaleString("ar-SA")}</b></CardContent></Card>
        <Card className="border-slate-200 shadow-none"><CardContent><span className="flex items-center gap-2 text-xs font-bold text-slate-400"><CreditCard className="size-4 text-cyan-700" />إجمالي المشتريات</span><b className="mt-2 block text-2xl text-cyan-800">{customer.totalSpend.toFixed(2)} ر.س</b></CardContent></Card>
        <Card className="border-slate-200 shadow-none"><CardContent><span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock3 className="size-4 text-cyan-700" />آخر طلب</span><b className="mt-2 block text-base">{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString("ar-SA") : "لا يوجد"}</b></CardContent></Card>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[22rem_1fr]">
        <div className="space-y-5">
          <Card className="border-slate-200 shadow-none">
            <CardHeader><CardTitle className="flex items-center gap-2 font-black"><CircleUserRound className="size-5 text-cyan-700" />بيانات العميل</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <InfoTile icon={Mail} label="البريد الإلكتروني">{customer.email}</InfoTile>
              <InfoTile icon={Phone} label="رقم الجوال" dir="ltr">{customer.phone || "غير مسجل"}</InfoTile>
              <InfoTile icon={MapPin} label="المدينة">{customer.city || "غير محددة"}</InfoTile>
              <InfoTile icon={MapPin} label="العنوان">{customer.address || "غير مسجل"}</InfoTile>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-none">
            <CardHeader><CardTitle className="flex items-center gap-2 font-black"><ShieldCheck className="size-5 text-cyan-700" />بيانات الحساب</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between gap-3"><span className="text-slate-400">تاريخ التسجيل</span><b>{new Date(customer.registeredAt).toLocaleString("ar-SA")}</b></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">آخر تحديث</span><b>{new Date(customer.updatedAt).toLocaleDateString("ar-SA")}</b></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">تأكيد البريد</span><b className={customer.isEmailVerified ? "text-emerald-700" : "text-amber-700"}>{customer.isEmailVerified ? "مؤكد" : "غير مؤكد"}</b></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">طريقة التسجيل</span><b>{customer.providers.length ? customer.providers.join("، ") : "بريد وكلمة مرور"}</b></div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" dir="rtl" className="min-w-0">
          <TabsList className="mb-4 h-11 w-full justify-start rounded-xl bg-white p-1 ring-1 ring-slate-200" variant="default">
            <TabsTrigger value="active" className="h-9 flex-none gap-2 px-4 data-active:bg-cyan-50 data-active:text-cyan-800 data-active:shadow-none"><Clock3 />الطلبات النشطة <Badge variant="outline" className="mr-1">{customer.activeOrders.length.toLocaleString("ar-SA")}</Badge></TabsTrigger>
            <TabsTrigger value="history" className="h-9 flex-none gap-2 px-4 data-active:bg-cyan-50 data-active:text-cyan-800 data-active:shadow-none"><History />سجل الطلبات <Badge variant="outline" className="mr-1">{customer.orderHistory.length.toLocaleString("ar-SA")}</Badge></TabsTrigger>
            <TabsTrigger value="coupons" className="h-9 flex-none gap-2 px-4 data-active:bg-cyan-50 data-active:text-cyan-800 data-active:shadow-none"><TicketPercent />رموز الخصم <Badge variant="outline" className="mr-1">{couponOrders.length.toLocaleString("ar-SA")}</Badge></TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">{customer.activeOrders.length ? customer.activeOrders.map((order) => <OrderCard key={order.id} order={order} />) : <EmptyOrders />}</TabsContent>
          <TabsContent value="history" className="space-y-4">{customer.orderHistory.length ? customer.orderHistory.map((order) => <OrderCard key={order.id} order={order} />) : <EmptyOrders history />}</TabsContent>
          <TabsContent value="coupons" className="space-y-3">
            {couponOrders.length ? couponOrders.map((order) => <Card key={order.id} className="border-emerald-100 shadow-none"><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><Badge className="mb-2 bg-emerald-600" dir="ltr">{order.couponCode}</Badge><Link href={`/admin/orders/${order.id}`} className="block font-black hover:text-cyan-800">#{order.orderNumber}</Link><small className="text-slate-400">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</small></div><div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm"><span className="text-slate-400">قبل الخصم</span><b>{order.subtotal.toFixed(2)} ر.س</b><span className="text-emerald-700">قيمة الخصم</span><b className="text-emerald-700">− {order.discountAmount.toFixed(2)} ر.س</b><span className="text-slate-400">الإجمالي</span><b className="text-cyan-800">{order.total.toFixed(2)} ر.س</b></div></CardContent></Card>) : <Card className="border-dashed py-14 text-center shadow-none"><CardContent><TicketPercent className="mx-auto mb-3 size-10 text-emerald-200"/><h3 className="font-black">لم يستخدم العميل رمز خصم بعد</h3></CardContent></Card>}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
