"use client";

import { useState, type FormEvent } from "react";
import { Plus, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import type { Coupon } from "@/domains/coupons/repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminRequest } from "../../api";
import { AdminPageHeader } from "../ui/admin-page-header";

function couponPayload(coupon: Coupon, isActive = coupon.isActive) {
  return {
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minSubtotal: coupon.minSubtotal,
    usageLimit: coupon.usageLimit,
    isActive,
    startsAt: coupon.startsAt,
    endsAt: coupon.endsAt,
  };
}

export function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  async function createCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const created = await adminRequest<Coupon>("/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: String(form.get("code") ?? ""),
          description: String(form.get("description") ?? ""),
          discountType: String(form.get("discountType") ?? "percentage"),
          discountValue: Number(form.get("discountValue")),
          minSubtotal: Number(form.get("minSubtotal") || 0),
          usageLimit: form.get("usageLimit") ? Number(form.get("usageLimit")) : null,
          isActive: true,
          startsAt: form.get("startsAt") ? new Date(String(form.get("startsAt"))).toISOString() : null,
          endsAt: form.get("endsAt") ? new Date(String(form.get("endsAt"))).toISOString() : null,
        }),
      });
      setCoupons((current) => [...current, { ...created, discountValue: Number(created.discountValue), minSubtotal: Number(created.minSubtotal) }].sort((a, b) => a.code.localeCompare(b.code)));
      setOpen(false);
      toast.success("تم إنشاء رمز الخصم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر إنشاء الرمز");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCoupon(coupon: Coupon, isActive: boolean) {
    setUpdating(coupon.id);
    try {
      await adminRequest(`/coupons/${coupon.id}`, { method: "PATCH", body: JSON.stringify(couponPayload(coupon, isActive)) });
      setCoupons((current) => current.map((item) => item.id === coupon.id ? { ...item, isActive } : item));
      toast.success(isActive ? "تم تفعيل الرمز" : "تم إيقاف الرمز");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر تحديث الرمز");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="العروض والاحتفاظ"
        title="رموز الخصم"
        description="أنشئ الرموز، حدّد قيمة الخصم وفترة الاستخدام، وتابع عدد مرات الاسترداد."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus /> رمز جديد</Button></DialogTrigger>
            <DialogContent dir="rtl" className="sm:max-w-2xl">
              <DialogHeader className="text-right"><DialogTitle>إنشاء رمز خصم</DialogTitle><DialogDescription>سيصبح الرمز متاحاً في صفحة إتمام الطلب فور حفظه.</DialogDescription></DialogHeader>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={createCoupon}>
                <div className="grid gap-2"><Label htmlFor="coupon-code">الرمز</Label><Input id="coupon-code" name="code" required minLength={2} maxLength={40} dir="ltr" placeholder="WELCOME10" className="uppercase shadow-none" /></div>
                <div className="grid gap-2"><Label>نوع الخصم</Label><Select name="discountType" defaultValue="percentage"><SelectTrigger className="shadow-none"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="percentage">نسبة مئوية</SelectItem><SelectItem value="fixed">مبلغ ثابت</SelectItem></SelectContent></Select></div>
                <div className="grid gap-2"><Label htmlFor="coupon-value">قيمة الخصم</Label><Input id="coupon-value" name="discountValue" required type="number" min="0.01" step="0.01" className="shadow-none" /></div>
                <div className="grid gap-2"><Label htmlFor="coupon-min">الحد الأدنى للطلب</Label><Input id="coupon-min" name="minSubtotal" type="number" min="0" step="0.01" defaultValue="0" className="shadow-none" /></div>
                <div className="grid gap-2"><Label htmlFor="coupon-limit">حد الاستخدام</Label><Input id="coupon-limit" name="usageLimit" type="number" min="1" placeholder="بدون حد" className="shadow-none" /></div>
                <div className="grid gap-2"><Label htmlFor="coupon-description">الوصف</Label><Input id="coupon-description" name="description" maxLength={240} placeholder="خصم ترحيبي للعملاء" className="shadow-none" /></div>
                <div className="grid gap-2"><Label htmlFor="coupon-start">يبدأ في</Label><Input id="coupon-start" name="startsAt" type="datetime-local" className="shadow-none" /></div>
                <div className="grid gap-2"><Label htmlFor="coupon-end">ينتهي في</Label><Input id="coupon-end" name="endsAt" type="datetime-local" className="shadow-none" /></div>
                <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button disabled={saving}>{saving ? "جاري الحفظ..." : "إنشاء الرمز"}</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Table>
          <TableHeader className="bg-slate-50"><TableRow><TableHead className="pr-5">الرمز</TableHead><TableHead>الخصم</TableHead><TableHead>الحد الأدنى</TableHead><TableHead>الاستخدام</TableHead><TableHead>الصلاحية</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="pr-5"><b className="block font-black text-cyan-800" dir="ltr">{coupon.code}</b><small className="text-slate-400">{coupon.description || "بدون وصف"}</small></TableCell>
                <TableCell className="font-bold">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `${coupon.discountValue.toFixed(2)} ر.س`}</TableCell>
                <TableCell>{coupon.minSubtotal.toFixed(2)} ر.س</TableCell>
                <TableCell><b>{coupon.usedCount}</b> / {coupon.usageLimit ?? "∞"}</TableCell>
                <TableCell className="text-xs text-slate-500">{coupon.endsAt ? `حتى ${new Date(coupon.endsAt).toLocaleDateString("ar-SA")}` : "بدون انتهاء"}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Switch checked={coupon.isActive} disabled={updating === coupon.id} onCheckedChange={(checked) => void toggleCoupon(coupon, checked)} /><Badge variant="outline">{coupon.isActive ? "مفعّل" : "متوقف"}</Badge></div></TableCell>
              </TableRow>
            ))}
            {!coupons.length && <TableRow><TableCell colSpan={6} className="py-16 text-center text-slate-400"><TicketPercent className="mx-auto mb-3 size-10" />لا توجد رموز خصم بعد</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
