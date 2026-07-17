import { asc, count, desc, eq, gte, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { account, categories, customerProfiles, orderItems, orders, products, subcategories, user } from "@/lib/db/schema";
import type { AdminCategory, AdminCustomerDetails, AdminCustomerOrder, AdminCustomerSummary, AdminOverview } from "./types";

export async function listCatalogHierarchy(): Promise<AdminCategory[]> {
  const db = getDb();
  const [categoryRows, subcategoryRows, productRows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select().from(subcategories).orderBy(asc(subcategories.sortOrder), asc(subcategories.id)),
    db.select({ categoryId: products.categoryId, subcategoryId: products.subcategoryId }).from(products),
  ]);
  return categoryRows.map((category) => ({
    ...category,
    productCount: productRows.filter((product) => product.categoryId === category.id).length,
    subcategories: subcategoryRows.filter((subcategory) => subcategory.categoryId === category.id).map((subcategory) => ({
      ...subcategory,
      productCount: productRows.filter((product) => product.subcategoryId === subcategory.id).length,
    })),
  }));
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const db = getDb();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const [orderTotals, catalogTotals, customerTotals, weekOrders, statusRows, recentOrders] = await Promise.all([
    db.select({ orders: count(), revenue: sql<string>`coalesce(sum(case when ${orders.status} <> 'cancelled' then ${orders.total} else 0 end), 0)` }).from(orders),
    db.select({
      total: count(),
      active: sql<number>`count(*) filter (where ${products.isActive} = true)`,
      hidden: sql<number>`count(*) filter (where ${products.isActive} = false)`,
      featured: sql<number>`count(*) filter (where ${products.isFeatured} = true)`,
      new: sql<number>`count(*) filter (where ${products.isNew} = true)`,
    }).from(products),
    db.select({ value: count() }).from(user).where(ne(user.role, "admin")),
    db.select().from(orders).where(gte(orders.createdAt, start)).orderBy(asc(orders.createdAt)),
    db.select({ status: orders.status, value: count() }).from(orders).groupBy(orders.status),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
  ]);
  const sales = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(start); date.setDate(start.getDate() + offset);
    const key = date.toISOString().slice(0, 10);
    const dayOrders = weekOrders.filter((order) => order.createdAt.toISOString().slice(0, 10) === key && order.status !== "cancelled");
    return { date: key, label: date.toLocaleDateString("ar-SA", { weekday: "short" }), orders: dayOrders.length, revenue: dayOrders.reduce((sum, order) => sum + Number(order.total), 0) };
  });
  const statusLabels: Record<string, string> = { new: "جديد", preparing: "قيد التحضير", out_for_delivery: "قيد التوصيل", delivered: "مكتمل", cancelled: "ملغي" };
  return {
    totals: {
      revenue: Number(orderTotals[0]?.revenue ?? 0), orders: orderTotals[0]?.orders ?? 0,
      products: catalogTotals[0]?.total ?? 0, customers: customerTotals[0]?.value ?? 0,
    },
    catalog: {
      active: Number(catalogTotals[0]?.active ?? 0),
      hidden: Number(catalogTotals[0]?.hidden ?? 0),
      featured: Number(catalogTotals[0]?.featured ?? 0),
      new: Number(catalogTotals[0]?.new ?? 0),
    },
    sales,
    statuses: Object.entries(statusLabels).map(([status, name]) => ({ name, value: statusRows.find((row) => row.status === status)?.value ?? 0 })).filter((item) => item.value > 0),
    recentOrders: recentOrders.map((order) => ({ id: order.id, orderNumber: order.orderNumber, customer: `${order.firstName} ${order.lastName}`, total: Number(order.total), status: order.status, createdAt: order.createdAt.toISOString() })),
  };
}

export async function listAdminCustomers(): Promise<AdminCustomerSummary[]> {
  const db = getDb();
  const customerRows = await db.select().from(user).where(ne(user.role, "admin")).orderBy(desc(user.createdAt));
  if (!customerRows.length) return [];

  const customerIds = customerRows.map((customer) => customer.id);
  const [profileRows, orderStats] = await Promise.all([
    db.select().from(customerProfiles).where(inArray(customerProfiles.userId, customerIds)),
    db
      .select({
        userId: orders.userId,
        orderCount: count(),
        totalSpend: sql<string>`coalesce(sum(case when ${orders.status} <> 'cancelled' then ${orders.total} else 0 end), 0)`,
        lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
      })
      .from(orders)
      .where(isNotNull(orders.userId))
      .groupBy(orders.userId),
  ]);

  return customerRows.map((customer) => {
    const profile = profileRows.find((item) => item.userId === customer.id);
    const stats = orderStats.find((item) => item.userId === customer.id);
    const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
    return {
      id: customer.id,
      name: profileName || customer.name,
      email: customer.email,
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      image: customer.image,
      isEmailVerified: customer.emailVerified,
      isBanned: customer.banned,
      registeredAt: customer.createdAt.toISOString(),
      orderCount: stats?.orderCount ?? 0,
      totalSpend: Number(stats?.totalSpend ?? 0),
      lastOrderAt: stats?.lastOrderAt ? new Date(stats.lastOrderAt).toISOString() : null,
    };
  });
}

export async function getAdminCustomer(customerId: string): Promise<AdminCustomerDetails | null> {
  const db = getDb();
  const [customer] = await db.select().from(user).where(eq(user.id, customerId)).limit(1);
  if (!customer || customer.role === "admin") return null;

  const [profileRows, providerRows, orderRows] = await Promise.all([
    db.select().from(customerProfiles).where(eq(customerProfiles.userId, customerId)).limit(1),
    db.select({ providerId: account.providerId }).from(account).where(eq(account.userId, customerId)),
    db.select().from(orders).where(eq(orders.userId, customerId)).orderBy(desc(orders.createdAt)),
  ]);
  const profile = profileRows[0];
  const orderIds = orderRows.map((order) => order.id);
  const itemRows = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];
  const productIds = [...new Set(itemRows.flatMap((item) => item.productId === null ? [] : [item.productId]))];
  const productRows = productIds.length
    ? await db.select({ id: products.id, imageUrl: products.imageUrl }).from(products).where(inArray(products.id, productIds))
    : [];
  const mappedOrders: AdminCustomerOrder[] = orderRows.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    city: order.city,
    address: order.address,
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    couponCode: order.couponCode,
    discountAmount: Number(order.discountAmount),
    total: Number(order.total),
    items: itemRows.filter((item) => item.orderId === order.id).map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      imageUrl: productRows.find((product) => product.id === item.productId)?.imageUrl ?? null,
      sizeLabel: item.sizeLabel,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  }));
  const activeStatuses = new Set(["new", "preparing", "out_for_delivery"]);
  const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
  const completedSpend = mappedOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return {
    id: customer.id,
    name: profileName || customer.name,
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    email: customer.email,
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    address: profile?.address ?? "",
    image: customer.image,
    isEmailVerified: customer.emailVerified,
    isBanned: customer.banned,
    registeredAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
    providers: [...new Set(providerRows.map((provider) => provider.providerId))],
    orderCount: mappedOrders.length,
    totalSpend: completedSpend,
    lastOrderAt: mappedOrders[0]?.createdAt ?? null,
    activeOrders: mappedOrders.filter((order) => activeStatuses.has(order.status)),
    orderHistory: mappedOrders.filter((order) => !activeStatuses.has(order.status)),
  };
}
