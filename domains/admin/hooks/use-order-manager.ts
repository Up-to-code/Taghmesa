"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/domains/catalog/types";
import { adminRequest } from "../api";

export type OrderFilter = "all" | OrderStatus;

export function useOrderManager(initialOrders: Order[]) {
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilterState] = useState<OrderFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const filteredOrders = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders],
  );
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visibleOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  function setFilter(value: OrderFilter) {
    setFilterState(value);
    setPage(1);
  }

  function setPageSize(value: number) {
    setPageSizeState(value);
    setPage(1);
  }

  function countByStatus(status: OrderFilter) {
    return status === "all" ? orders.length : orders.filter((order) => order.status === status).length;
  }

  async function update(id: number, status: OrderStatus) {
    setUpdating(id);
    try {
      await adminRequest(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
      toast.success("تم تحديث حالة الطلب");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر تحديث الطلب");
    } finally {
      setUpdating(null);
    }
  }

  return {
    orders,
    visibleOrders,
    filteredCount: filteredOrders.length,
    updating,
    filter,
    page,
    pageCount,
    pageSize,
    countByStatus,
    setFilter,
    setPage,
    setPageSize,
    update,
  };
}
