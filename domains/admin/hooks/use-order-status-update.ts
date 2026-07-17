"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@/domains/catalog/types";
import { adminRequest } from "../api";

export function useOrderStatusUpdate(orderId: number, initialStatus: OrderStatus) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(nextStatus: OrderStatus) {
    if (nextStatus === status) return;

    setIsUpdating(true);
    try {
      await adminRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setStatus(nextStatus);
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر تحديث الطلب");
    } finally {
      setIsUpdating(false);
    }
  }

  return { status, isUpdating, updateStatus };
}
