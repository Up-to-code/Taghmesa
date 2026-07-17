"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, ReceiptText } from "lucide-react";
import type { Order, OrderStatus } from "@/domains/catalog/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orderStatuses } from "./order-status";

type OrderTableProps = {
  orders: Order[];
  filteredCount: number;
  updating: number | null;
  page: number;
  pageCount: number;
  pageSize: number;
  onUpdate: (id: number, status: OrderStatus) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function OrderTable({ orders, filteredCount, updating, page, pageCount, pageSize, onUpdate, onPageChange, onPageSizeChange }: OrderTableProps) {
  if (!orders.length) {
    return (
      <Card className="border-dashed py-16 text-center shadow-none">
        <CardContent>
          <ReceiptText className="mx-auto mb-4 size-12 text-blue-200" />
          <h2 className="font-black">لا توجد طلبات في هذه الحالة</h2>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200 py-0 shadow-none">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="pr-5">رقم الطلب</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>العناصر</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead className="min-w-44">الحالة</TableHead>
            <TableHead className="w-16 text-center">عرض</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = orderStatuses[order.status];
            const StatusIcon = status.icon;
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <TableRow
                key={order.id}
                className="group"
              >
                <TableCell className="p-0 font-black text-slate-900">
                  <Link href={`/admin/orders/${order.id}`} className="block px-2 py-4 pr-5 group-hover:text-cyan-800">#{order.orderNumber}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="block py-2">
                    <b className="block text-sm text-slate-800">{order.firstName} {order.lastName}</b>
                    <small className="text-slate-400">{order.city}</small>
                  </Link>
                </TableCell>
                <TableCell className="p-0 text-xs text-slate-500"><Link href={`/admin/orders/${order.id}`} className="block px-2 py-4">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</Link></TableCell>
                <TableCell className="p-0 text-slate-600"><Link href={`/admin/orders/${order.id}`} className="block px-2 py-4">{itemCount}</Link></TableCell>
                <TableCell className="p-0 font-black text-cyan-800"><Link href={`/admin/orders/${order.id}`} className="block px-2 py-4">{order.total.toFixed(2)} ر.س</Link></TableCell>
                <TableCell>
                  <Select value={order.status} disabled={updating === order.id} onValueChange={(value) => onUpdate(order.id, value as OrderStatus)}>
                    <SelectTrigger className="w-full bg-white shadow-none">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <Badge variant="outline" className={`size-7 justify-center rounded-lg p-0 ${status.className}`}><StatusIcon className="size-3.5" /></Badge>
                          {status.label}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {Object.entries(orderStatuses).map(([value, item]) => <SelectItem key={value} value={value}>{item.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="size-4" />
                      <span className="sr-only">فتح صفحة تفاصيل الطلب</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>عرض</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-20 bg-white shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent dir="rtl">
              {[10, 20, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}
            </SelectContent>
          </Select>
          <span>من أصل {filteredCount} طلب</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="الصفحة السابقة"><ChevronRight /></Button>
          <span className="min-w-24 text-center text-xs font-bold text-slate-600">صفحة {page} من {pageCount}</span>
          <Button variant="outline" size="icon-sm" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="الصفحة التالية"><ChevronLeft /></Button>
        </div>
      </div>
    </Card>
  );
}
