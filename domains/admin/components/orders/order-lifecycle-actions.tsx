"use client";

import { LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/domains/catalog/types";
import { useOrderStatusUpdate } from "../../hooks/use-order-status-update";
import { orderStatuses } from "./order-status";

export function OrderLifecycleActions({ orderId, initialStatus }: { orderId: number; initialStatus: OrderStatus }) {
  const { status, isUpdating, updateStatus } = useOrderStatusUpdate(orderId, initialStatus);
  const current = orderStatuses[status];
  const StatusIcon = current.icon;

  return (
    <div className="flex min-w-56 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3">
      <span className="text-[10px] font-bold text-slate-400">إجراء سريع · دورة حياة الطلب</span>
      <Select
        value={status}
        disabled={isUpdating}
        onValueChange={(value) => void updateStatus(value as OrderStatus)}
      >
        <SelectTrigger className="w-full bg-white shadow-none" aria-label="تغيير حالة الطلب">
          <SelectValue>
            <span className="flex items-center gap-2">
              <Badge variant="outline" className={`size-7 justify-center rounded-lg p-0 ${current.className}`}>
                {isUpdating ? <LoaderCircle className="size-3.5 animate-spin" /> : <StatusIcon className="size-3.5" />}
              </Badge>
              {current.label}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent dir="rtl">
          {Object.entries(orderStatuses).map(([value, item]) => (
            <SelectItem key={value} value={value}>{item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
