import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, ExternalLink, ImageIcon, MapPin, NotebookText, Phone, UserRound } from "lucide-react";
import type { Order } from "@/domains/catalog/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminPageHeader } from "../ui/admin-page-header";
import { OrderLifecycleActions } from "./order-lifecycle-actions";

function Detail({ icon: Icon, label, children, dir }: { icon: typeof UserRound; label: string; children: React.ReactNode; dir?: "ltr" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
        <Icon className="size-4 text-cyan-700" />
        {label}
      </span>
      <b className="block text-sm font-bold text-slate-800" dir={dir}>{children}</b>
    </div>
  );
}

export function OrderDetailsView({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Button asChild variant="ghost" className="mb-3 -mr-3 w-fit text-slate-500">
        <Link href="/admin/orders"><ArrowRight /> العودة إلى الطلبات</Link>
      </Button>
      <AdminPageHeader
        eyebrow="تفاصيل الطلب"
        title={`#${order.orderNumber}`}
        description="كل بيانات العميل، الدفع، العنوان، ومحتويات الطلب في صفحة مستقلة."
        action={<OrderLifecycleActions orderId={order.id} initialStatus={order.status} />}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Card className="border-slate-200 shadow-none">
            <CardContent className="space-y-4">
              <h2 className="font-black text-slate-900">بيانات الطلب والعميل</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Detail icon={UserRound} label="العميل">{order.firstName} {order.lastName}</Detail>
                <Detail icon={Phone} label="رقم الجوال" dir="ltr">{order.phone}</Detail>
                <Detail icon={CalendarDays} label="تاريخ الطلب">{new Date(order.createdAt).toLocaleString("ar-SA")}</Detail>
                <Detail icon={CreditCard} label="طريقة الدفع">الدفع عند الاستلام</Detail>
                <Detail icon={MapPin} label="المدينة">{order.city}</Detail>
                <Detail icon={MapPin} label="عنوان التوصيل">{order.address}</Detail>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-blue-500">
                  <NotebookText className="size-4" /> ملاحظات الطلب
                </span>
                <p className="text-sm font-medium text-slate-700">{order.notes || "لا توجد ملاحظات على هذا الطلب."}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-none">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-slate-900">محتويات الطلب</h2>
                <span className="text-xs font-bold text-slate-400">{itemCount} عناصر</span>
              </div>
              <div className="overflow-hidden rounded-2xl border">
                {order.items.map((item, index) => (
                  <div key={item.id ?? index} className="grid gap-4 border-b p-4 text-sm last:border-b-0 md:grid-cols-[5.5rem_1fr_auto] md:items-center">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                      {item.productImageUrl ? (
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          fill
                          unoptimized
                          sizes="88px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-3xl" aria-label="لا توجد صورة للمنتج">
                          {item.productEmoji || <ImageIcon className="size-7 text-slate-300" />}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.productId ? (
                          <Link href={`/admin/products/${item.productId}`} className="font-black text-slate-900 hover:text-cyan-800 hover:underline">
                            {item.productName}
                          </Link>
                        ) : (
                          <b className="text-slate-900">{item.productName}</b>
                        )}
                        {item.productCategory && <Badge variant="secondary">{item.productCategory}</Badge>}
                        {item.productIsActive === false && <Badge variant="outline" className="border-slate-200 text-slate-500">منتج مخفي</Badge>}
                      </div>
                      {item.productNameEn && <p className="text-xs font-semibold text-slate-400" dir="ltr">{item.productNameEn}</p>}
                      {item.productDescription && <p className="line-clamp-2 max-w-2xl text-xs leading-6 text-slate-500">{item.productDescription}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>الخيار: <b className="text-slate-700">{item.sizeLabel}</b></span>
                        <span>الكمية: <b className="text-slate-700">{item.quantity}</b></span>
                        <span>سعر الوحدة: <b className="text-slate-700">{item.unitPrice.toFixed(2)} ر.س</b></span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-3 md:block md:min-w-28 md:text-left">
                      <span className="block text-[10px] font-bold text-slate-400">إجمالي المنتج</span>
                      <b className="block text-base text-cyan-800">{(item.unitPrice * item.quantity).toFixed(2)} ر.س</b>
                      {item.productId && (
                        <Button asChild variant="ghost" size="sm" className="mt-1 h-7 px-0 text-xs text-slate-500 hover:text-cyan-800">
                          <Link href={`/admin/products/${item.productId}`}>
                            فتح المنتج <ExternalLink className="size-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit border-slate-200 shadow-none xl:sticky xl:top-24">
          <CardContent className="space-y-4">
            <h2 className="font-black text-slate-900">ملخص الدفع</h2>
            <div className="flex justify-between text-sm text-slate-500"><span>المجموع الفرعي</span><b>{order.subtotal.toFixed(2)} ر.س</b></div>
            {order.couponCode && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700"><span className="block text-[10px] font-bold">رمز الخصم المستخدم</span><b dir="ltr">{order.couponCode}</b></div>}
            {order.discountAmount > 0 && <div className="flex justify-between text-sm text-emerald-700"><span>الخصم</span><b>− {order.discountAmount.toFixed(2)} ر.س</b></div>}
            <div className="flex justify-between text-sm text-slate-500"><span>رسوم التوصيل</span><b>{order.deliveryFee.toFixed(2)} ر.س</b></div>
            <Separator />
            <div className="flex justify-between text-cyan-800"><span className="font-black">الإجمالي</span><b className="text-2xl">{order.total.toFixed(2)} ر.س</b></div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
