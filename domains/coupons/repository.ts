import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { coupons } from "@/lib/db/schema";

export type Coupon = {
  id: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSubtotal: number;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

function mapCoupon(row: typeof coupons.$inferSelect): Coupon {
  return {
    ...row,
    discountType: row.discountType as Coupon["discountType"],
    discountValue: Number(row.discountValue),
    minSubtotal: Number(row.minSubtotal),
    startsAt: row.startsAt?.toISOString() ?? null,
    endsAt: row.endsAt?.toISOString() ?? null,
  };
}

export async function listCoupons(): Promise<Coupon[]> {
  const rows = await getDb().select().from(coupons).orderBy(asc(coupons.code));
  return rows.map(mapCoupon);
}

export type CouponResolution =
  | { valid: true; coupon: Coupon; discount: number }
  | { valid: false; error: string };

export async function resolveCoupon(rawCode: string, subtotal: number): Promise<CouponResolution> {
  const code = rawCode.trim().toUpperCase();
  const [row] = await getDb().select().from(coupons).where(eq(coupons.code, code)).limit(1);
  const coupon = row ? mapCoupon(row) : null;
  if (!coupon) return { valid: false, error: "رمز الخصم غير موجود" };
  if (!coupon.isActive) return { valid: false, error: "رمز الخصم غير مفعّل" };

  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) return { valid: false, error: "رمز الخصم لم يبدأ بعد" };
  if (coupon.endsAt && new Date(coupon.endsAt).getTime() < now) return { valid: false, error: "انتهت صلاحية رمز الخصم" };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return { valid: false, error: "تم استهلاك رمز الخصم بالكامل" };
  if (subtotal < coupon.minSubtotal) return { valid: false, error: `الحد الأدنى للطلب ${coupon.minSubtotal.toFixed(2)} ر.س` };

  const rawDiscount = coupon.discountType === "percentage"
    ? subtotal * (coupon.discountValue / 100)
    : coupon.discountValue;
  return { valid: true, coupon, discount: Math.min(subtotal, Math.max(0, rawDiscount)) };
}
