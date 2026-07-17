"use client";

import type { Order } from "@/domains/catalog/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrderManager } from "../../hooks/use-order-manager";
import { AdminPageHeader } from "../ui/admin-page-header";
import { orderFilters } from "./order-status";
import { OrderTable } from "./order-table";

export function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const manager = useOrderManager(initialOrders);

  return (
    <>
      <AdminPageHeader
        eyebrow="سير العمل"
        title="الطلبات"
        description="قائمة كاملة بكل الطلبات مع التصفح، تفاصيل الدفع، وتحديث الحالة مباشرة."
      />

      <Tabs value={manager.filter} onValueChange={(value) => manager.setFilter(value as typeof manager.filter)} dir="rtl">
        <TabsList className="mb-5 h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-blue-100 bg-white p-2 shadow-none">
          {orderFilters.map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="h-10 min-w-max gap-2 rounded-xl px-4 data-active:bg-blue-600 data-active:text-white">
              <span>{label}</span>
              <b className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] data-active:bg-white/20">{manager.countByStatus(value)}</b>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <OrderTable
        orders={manager.visibleOrders}
        filteredCount={manager.filteredCount}
        updating={manager.updating}
        page={manager.page}
        pageCount={manager.pageCount}
        pageSize={manager.pageSize}
        onUpdate={manager.update}
        onPageChange={manager.setPage}
        onPageSizeChange={manager.setPageSize}
      />
    </>
  );
}
