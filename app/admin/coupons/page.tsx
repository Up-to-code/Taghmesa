import { AdminShell } from "@/domains/admin/components/admin-shell";
import { CouponManager } from "@/domains/admin/components/coupons/coupon-manager";
import { listCoupons } from "@/domains/coupons/repository";
import { requireAdminPage } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "رموز الخصم — لوحة تحكم تغميسة" };

export default async function AdminCouponsPage() {
  const admin = await requireAdminPage();
  const coupons = await listCoupons();
  return <AdminShell username={admin.name}><CouponManager initialCoupons={coupons} /></AdminShell>;
}
