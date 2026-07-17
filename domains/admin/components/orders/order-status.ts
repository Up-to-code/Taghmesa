import { CheckCircle2, CircleX, Clock3, ReceiptText, Truck } from "lucide-react";
import type { OrderStatus } from "@/domains/catalog/types";

export const orderStatuses: Record<
  OrderStatus,
  { label: string; short: string; icon: typeof Clock3; className: string }
> = {
  new: { label: "طلب مستلم", short: "مستلم", icon: ReceiptText, className: "border-blue-100 bg-blue-50 text-blue-700" },
  preparing: { label: "قيد التحضير", short: "تحضير", icon: Clock3, className: "border-amber-100 bg-amber-50 text-amber-700" },
  out_for_delivery: { label: "خرج للتوصيل", short: "توصيل", icon: Truck, className: "border-violet-100 bg-violet-50 text-violet-700" },
  delivered: { label: "تم التوصيل", short: "مكتمل", icon: CheckCircle2, className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  cancelled: { label: "مرفوض أو ملغي", short: "ملغي", icon: CircleX, className: "border-rose-100 bg-rose-50 text-rose-700" },
};

export const orderFilters: Array<["all" | OrderStatus, string]> = [
  ["all", "الكل"],
  ["new", "المستلمة"],
  ["preparing", "التحضير"],
  ["out_for_delivery", "التوصيل"],
  ["delivered", "المكتملة"],
  ["cancelled", "الملغاة"],
];
