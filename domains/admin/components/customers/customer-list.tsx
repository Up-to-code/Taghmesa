import Link from "next/link";
import { ChevronLeft, Mail, MapPin, ShoppingBag, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminCustomerSummary } from "../../types";
import { AdminPageHeader } from "../ui/admin-page-header";

function CustomerAvatar({ customer }: { customer: AdminCustomerSummary }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-cyan-50 text-sm font-black text-cyan-800">
      {customer.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={customer.image} alt="" className="size-full object-cover" />
      ) : customer.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function CustomerList({ customers }: { customers: AdminCustomerSummary[] }) {
  const totalOrders = customers.reduce((sum, customer) => sum + customer.orderCount, 0);
  const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow="إدارة العلاقات"
        title="العملاء"
        description="حسابات العملاء المسجلين، بيانات التواصل، وقيمة علاقتهم بالمتجر. افتح أي عميل لرؤية رحلته وطلباته كاملة."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-none"><CardContent><span className="text-xs font-bold text-slate-400">العملاء المسجلون</span><b className="mt-2 block text-2xl text-slate-900">{customers.length.toLocaleString("ar-SA")}</b></CardContent></Card>
        <Card className="border-slate-200 shadow-none"><CardContent><span className="text-xs font-bold text-slate-400">إجمالي الطلبات</span><b className="mt-2 block text-2xl text-slate-900">{totalOrders.toLocaleString("ar-SA")}</b></CardContent></Card>
        <Card className="border-slate-200 shadow-none"><CardContent><span className="text-xs font-bold text-slate-400">قيمة المشتريات</span><b className="mt-2 block text-2xl text-cyan-800">{totalSpend.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س</b></CardContent></Card>
      </div>

      {customers.length ? (
        <Card className="overflow-hidden border-slate-200 py-0 shadow-none">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pr-5">العميل</TableHead>
                <TableHead>التواصل</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>الطلبات</TableHead>
                <TableHead>إجمالي الإنفاق</TableHead>
                <TableHead>آخر طلب</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="group">
                  <TableCell className="p-0">
                    <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-3 px-5 py-4">
                      <CustomerAvatar customer={customer} />
                      <span><b className="block text-sm text-slate-900 group-hover:text-cyan-800">{customer.name}</b><small className="mt-1 block text-slate-400">منذ {new Date(customer.registeredAt).toLocaleDateString("ar-SA")}</small></span>
                    </Link>
                  </TableCell>
                  <TableCell><span className="flex items-center gap-1.5 text-xs text-slate-600"><Mail className="size-3.5 text-slate-400" />{customer.email}</span>{customer.phone && <span className="mt-1 block text-xs text-slate-400" dir="ltr">{customer.phone}</span>}</TableCell>
                  <TableCell><span className="flex items-center gap-1.5 text-xs"><MapPin className="size-3.5 text-cyan-700" />{customer.city || "غير محددة"}</span></TableCell>
                  <TableCell><Badge variant="outline" className="gap-1.5"><ShoppingBag />{customer.orderCount.toLocaleString("ar-SA")}</Badge></TableCell>
                  <TableCell className="font-black text-cyan-800">{customer.totalSpend.toFixed(2)} ر.س</TableCell>
                  <TableCell className="text-xs text-slate-500">{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString("ar-SA") : "لا يوجد"}</TableCell>
                  <TableCell><Link href={`/admin/customers/${customer.id}`} aria-label={`فتح ملف ${customer.name}`} className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-cyan-50 hover:text-cyan-800"><ChevronLeft className="size-4" /></Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="border-dashed py-16 text-center shadow-none"><CardContent><UsersRound className="mx-auto mb-4 size-12 text-cyan-200" /><h2 className="font-black">لا يوجد عملاء مسجلون بعد</h2><p className="mt-2 text-sm text-slate-400">ستظهر حسابات العملاء هنا بعد التسجيل.</p></CardContent></Card>
      )}
    </>
  );
}
