"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/domains/catalog/types";
import { adminRequest } from "../api";

const labels: Record<OrderStatus, string> = { new: "جديد", preparing: "قيد التحضير", out_for_delivery: "قيد التوصيل", delivered: "تم التوصيل", cancelled: "ملغي" };

export function OrderManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders); const [message, setMessage] = useState("");
  async function update(id: number, status: OrderStatus) {
    try { await adminRequest(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order)); setMessage("تم تحديث حالة الطلب"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "تعذّر التحديث"); }
  }
  return <><div className="admin-page-title"><h1>الطلبات ({orders.length})</h1>{message && <span>{message}</span>}</div>{!orders.length && <div className="admin-card">لا توجد طلبات بعد</div>}{orders.map((order) => <details className="admin-card order-card" key={order.id}><summary><span>#{order.orderNumber} — {order.firstName} {order.lastName} <b className={`status ${order.status}`}>{labels[order.status]}</b></span><strong>{order.total.toFixed(2)} ر.س</strong></summary><div className="order-details"><dl><dt>الجوال</dt><dd dir="ltr">{order.phone}</dd><dt>المدينة</dt><dd>{order.city}</dd><dt>العنوان</dt><dd>{order.address}</dd>{order.notes && <><dt>ملاحظات</dt><dd>{order.notes}</dd></>}<dt>التاريخ</dt><dd>{new Date(order.createdAt).toLocaleString("ar-SA")}</dd></dl><div className="admin-order-items">{order.items.map((item, index) => <p key={index}>{item.productName} — {item.sizeLabel} × {item.quantity} = {(item.unitPrice * item.quantity).toFixed(2)} ر.س</p>)}</div><label className="status-update">الحالة<select value={order.status} onChange={(event) => update(order.id, event.target.value as OrderStatus)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div></details>)}</>;
}
