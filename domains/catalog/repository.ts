import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orderItems, orders, productSizes, products } from "@/lib/db/schema";
import type { Order, Product } from "./types";

function groupProducts(productRows: (typeof products.$inferSelect)[], sizeRows: (typeof productSizes.$inferSelect)[]): Product[] {
  const sizesByProduct = new Map<number, Product["sizes"]>();
  for (const size of sizeRows) {
    const current = sizesByProduct.get(size.productId) ?? [];
    current.push({ id: size.id, label: size.label, price: Number(size.price), caloriesLabel: size.caloriesLabel });
    sizesByProduct.set(size.productId, current);
  }
  return productRows.map((product) => ({
    id: product.id, nameAr: product.nameAr, nameEn: product.nameEn, category: product.category,
    categoryId: product.categoryId, subcategoryId: product.subcategoryId,
    emoji: product.emoji, description: product.description, imageUrl: product.imageUrl,
    isFeatured: product.isFeatured, isNew: product.isNew, isActive: product.isActive,
    sortOrder: product.sortOrder, sizes: sizesByProduct.get(product.id) ?? [],
  }));
}

export async function listProducts(activeOnly = true): Promise<Product[]> {
  const db = getDb();
  const productRows = activeOnly
    ? await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.sortOrder), asc(products.id))
    : await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
  if (!productRows.length) return [];
  const sizeRows = await db.select().from(productSizes).where(inArray(productSizes.productId, productRows.map((p) => p.id))).orderBy(asc(productSizes.productId), asc(productSizes.sortOrder), asc(productSizes.id));
  return groupProducts(productRows, sizeRows);
}

function mapOrder(
  order: typeof orders.$inferSelect,
  items: Array<{
    item: typeof orderItems.$inferSelect;
    product: {
      nameEn: string;
      imageUrl: string | null;
      emoji: string;
      category: string;
      description: string;
      isActive: boolean;
    } | null;
  }>,
): Order {
  return {
    ...order,
    paymentMethod: "cod" as const,
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    status: order.status as Order["status"],
    createdAt: order.createdAt.toISOString(),
    items: items.map(({ item, product }) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productNameEn: product?.nameEn ?? null,
      productImageUrl: product?.imageUrl ?? null,
      productEmoji: product?.emoji ?? null,
      productCategory: product?.category ?? null,
      productDescription: product?.description ?? null,
      productIsActive: product?.isActive ?? null,
      sizeLabel: item.sizeLabel,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  };
}

function selectOrderItems() {
  return {
    item: orderItems,
    product: {
      nameEn: products.nameEn,
      imageUrl: products.imageUrl,
      emoji: products.emoji,
      category: products.category,
      description: products.description,
      isActive: products.isActive,
    },
  };
}

export async function listOrders(): Promise<Order[]> {
  const db = getDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  if (!rows.length) return [];
  const items = await db
    .select(selectOrderItems())
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(inArray(orderItems.orderId, rows.map((o) => o.id)));
  return rows.map((order) => mapOrder(order, items.filter(({ item }) => item.orderId === order.id)));
}

export async function getOrder(orderId: number): Promise<Order | null> {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db
    .select(selectOrderItems())
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));
  return mapOrder(order, items);
}
