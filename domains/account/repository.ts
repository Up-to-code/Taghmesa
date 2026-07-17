import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { customerProfiles, orderItems, orders } from "@/lib/db/schema";
import type { Order } from "@/domains/catalog/types";

export type CustomerProfile = typeof customerProfiles.$inferSelect;

function mapOrder(
  order: typeof orders.$inferSelect,
  items: (typeof orderItems.$inferSelect)[],
): Order {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    paymentMethod: "cod",
    subtotal: Number(order.subtotal),
    couponCode: order.couponCode,
    discountAmount: Number(order.discountAmount),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    status: order.status as Order["status"],
    createdAt: order.createdAt.toISOString(),
    items: items.filter((item) => item.orderId === order.id).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      sizeLabel: item.sizeLabel,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  };
}

export async function getCustomerProfile(userId: string) {
  const [profile] = await getDb().select().from(customerProfiles).where(eq(customerProfiles.userId, userId)).limit(1);
  return profile ?? null;
}

export async function getAccountDashboard(userId: string) {
  const db = getDb();
  const [profile, orderRows] = await Promise.all([
    getCustomerProfile(userId),
    db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).limit(100),
  ]);
  const items = orderRows.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderRows.map((order) => order.id)))
    : [];
  return { profile, orders: orderRows.map((order) => mapOrder(order, items)) };
}
