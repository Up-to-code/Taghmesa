import { randomInt } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { del, put } from "@vercel/blob";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { customerProfiles, orderItems, orders, productSizes, products, user } from "@/lib/db/schema";
import { logger } from "@/lib/logger";
import { listOrders, listProducts } from "@/domains/catalog/repository";
import { claimOrderInput, orderInput, productInput, profileInput, sizeInput, statusInput } from "./schemas";

type Variables = { admin: { id: string; name: string; email: string } };
const app = new Hono<{ Variables: Variables }>().basePath("/api");

function validationHook(result: { success: boolean; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } }, c: Context) {
  if (!result.success) return c.json({ error: "البيانات المدخلة غير صالحة", issues: result.error?.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) ?? [] }, 400);
}

function validateOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return Boolean(forwardedHost && origin === `${forwardedProto}://${forwardedHost}`);
}

app.use("/admin/*", async (c, next) => {
  if (c.req.method !== "GET" && !validateOrigin(c.req.raw)) return c.json({ error: "مصدر الطلب غير مسموح" }, 403);
  await next();
});

app.get("/health", (c) => c.json({ ok: true }));

app.get("/products", async (c) => c.json(await listProducts(true)));

app.post("/orders", zValidator("json", orderInput, validationHook), async (c) => {
  const input = c.req.valid("json");
  const current = await auth.api.getSession({ headers: c.req.raw.headers });
  const merged = new Map<number, { productId: number; sizeId: number; quantity: number }>();
  for (const item of input.items) {
    const current = merged.get(item.sizeId);
    if (current && current.productId !== item.productId) return c.json({ error: "عناصر السلة غير صالحة" }, 422);
    merged.set(item.sizeId, { ...item, quantity: Math.min(99, (current?.quantity ?? 0) + item.quantity) });
  }

  const db = getDb();
  const requested = [...merged.values()];
  const available = await db.select({
    sizeId: productSizes.id, productId: products.id, productName: products.nameAr,
    sizeLabel: productSizes.label, price: productSizes.price,
  }).from(productSizes).innerJoin(products, eq(products.id, productSizes.productId))
    .where(and(inArray(productSizes.id, requested.map((item) => item.sizeId)), eq(products.isActive, true)));

  if (available.length !== requested.length) return c.json({ error: "بعض منتجات السلة لم تعد متاحة" }, 422);
  const verified = requested.map((requestedItem) => {
    const row = available.find((candidate) => candidate.sizeId === requestedItem.sizeId && candidate.productId === requestedItem.productId);
    if (!row) return null;
    return { ...row, quantity: requestedItem.quantity, priceNumber: Number(row.price) };
  });
  if (verified.some((item) => !item)) return c.json({ error: "تعذّر التحقق من عناصر السلة" }, 422);

  const validItems = verified.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotal = validItems.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);
  const deliveryFee = Number(process.env.DELIVERY_FEE ?? 0);
  const total = subtotal + deliveryFee;
  const orderNumber = `TG-${Date.now().toString(36).toUpperCase()}${randomInt(100, 999)}`;

  await db.transaction(async (tx) => {
    const [created] = await tx.insert(orders).values({
      userId: current?.user.id ?? null, orderNumber, firstName: input.firstName, lastName: input.lastName, phone: input.phone,
      city: input.city, address: input.address, notes: input.notes || null, paymentMethod: "cod",
      subtotal: subtotal.toFixed(2), deliveryFee: deliveryFee.toFixed(2), total: total.toFixed(2), status: "new",
    }).returning({ id: orders.id });
    await tx.insert(orderItems).values(validItems.map((item) => ({
      orderId: created.id, productId: item.productId, productName: item.productName,
      sizeLabel: item.sizeLabel, unitPrice: item.priceNumber.toFixed(2), quantity: item.quantity,
    })));
    if (current) {
      await tx.insert(customerProfiles).values({
        userId: current.user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        city: input.city,
        address: input.address,
      }).onConflictDoUpdate({
        target: customerProfiles.userId,
        set: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          city: input.city,
          address: input.address,
          updatedAt: new Date(),
        },
      });
    }
  });

  return c.json({ orderNumber, subtotal, deliveryFee, total }, 201);
});

type CustomerVariables = { customer: { id: string; name: string; email: string } };
const account = new Hono<{ Variables: CustomerVariables }>();

account.use("*", async (c, next) => {
  if (c.req.method !== "GET" && !validateOrigin(c.req.raw)) return c.json({ error: "مصدر الطلب غير مسموح" }, 403);
  const current = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!current) return c.json({ error: "يجب تسجيل الدخول" }, 401);
  c.set("customer", { id: current.user.id, name: current.user.name, email: current.user.email });
  await next();
});

account.patch("/profile", zValidator("json", profileInput, validationHook), async (c) => {
  const input = c.req.valid("json");
  const customer = c.get("customer");
  const db = getDb();
  const profile = await db.transaction(async (tx) => {
    const [saved] = await tx.insert(customerProfiles).values({ userId: customer.id, ...input })
      .onConflictDoUpdate({ target: customerProfiles.userId, set: { ...input, updatedAt: new Date() } })
      .returning();
    await tx.update(user).set({ name: `${input.firstName} ${input.lastName}`, updatedAt: new Date() }).where(eq(user.id, customer.id));
    return saved;
  });
  return c.json({ profile });
});

account.post("/orders/claim", zValidator("json", claimOrderInput, validationHook), async (c) => {
  const { orderNumber, phone } = c.req.valid("json");
  const customer = c.get("customer");
  const [claimed] = await getDb().update(orders).set({ userId: customer.id }).where(and(
    eq(orders.orderNumber, orderNumber.replace(/^#/, "")),
    eq(orders.phone, phone),
    isNull(orders.userId),
  )).returning({ id: orders.id, orderNumber: orders.orderNumber });
  if (!claimed) return c.json({ error: "لم نجد طلباً غير مرتبط بهذه البيانات" }, 404);
  return c.json({ order: claimed });
});

app.route("/account", account);

const admin = new Hono<{ Variables: Variables }>();

admin.use("*", async (c, next) => {
  const current = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!current) return c.json({ error: "يجب تسجيل الدخول" }, 401);
  if (current.user.role !== "admin") return c.json({ error: "ليس لديك صلاحية الإدارة" }, 403);
  c.set("admin", { id: current.user.id, name: current.user.name, email: current.user.email });
  await next();
});

admin.get("/products", async (c) => c.json(await listProducts(false)));

admin.post("/products", zValidator("json", productInput.extend({ size: sizeInput }), validationHook), async (c) => {
  const input = c.req.valid("json");
  const db = getDb();
  const created = await db.transaction(async (tx) => {
    const [product] = await tx.insert(products).values({
      nameAr: input.nameAr, nameEn: input.nameEn, category: input.category, emoji: input.emoji,
      description: input.description, isActive: input.isActive, isFeatured: input.isFeatured,
      isNew: input.isNew, sortOrder: input.sortOrder,
    }).returning();
    await tx.insert(productSizes).values({ productId: product.id, ...input.size, price: input.size.price.toFixed(2) });
    return product;
  });
  return c.json(created, 201);
});

admin.patch("/products/:id", zValidator("json", productInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "معرّف المنتج غير صالح" }, 400);
  const input = c.req.valid("json");
  const [updated] = await getDb().update(products).set({ ...input, updatedAt: new Date() }).where(eq(products.id, id)).returning();
  if (!updated) return c.json({ error: "المنتج غير موجود" }, 404);
  return c.json(updated);
});

admin.post("/products/:id/sizes", zValidator("json", sizeInput, validationHook), async (c) => {
  const productId = Number(c.req.param("id"));
  const input = c.req.valid("json");
  const [created] = await getDb().insert(productSizes).values({ productId, ...input, price: input.price.toFixed(2) }).returning();
  return c.json(created, 201);
});

admin.patch("/sizes/:id", zValidator("json", sizeInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const input = c.req.valid("json");
  const [updated] = await getDb().update(productSizes).set({ ...input, price: input.price.toFixed(2) }).where(eq(productSizes.id, id)).returning();
  if (!updated) return c.json({ error: "الحجم غير موجود" }, 404);
  return c.json(updated);
});

admin.delete("/sizes/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [deleted] = await getDb().delete(productSizes).where(eq(productSizes.id, id)).returning({ id: productSizes.id });
  if (!deleted) return c.json({ error: "الحجم غير موجود" }, 404);
  return c.json({ ok: true });
});

admin.post("/products/:id/image", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.raw.formData();
  const file = body.get("file");
  if (!(file instanceof File)) return c.json({ error: "اختر صورة" }, 422);
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 4 * 1024 * 1024) {
    return c.json({ error: "الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 4MB" }, 422);
  }
  const [current] = await getDb().select({ imageUrl: products.imageUrl }).from(products).where(eq(products.id, id)).limit(1);
  if (!current) return c.json({ error: "المنتج غير موجود" }, 404);
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const blob = await put(`products/${id}-${Date.now()}.${extension}`, file, { access: "public", addRandomSuffix: true });
  try {
    await getDb().update(products).set({ imageUrl: blob.url, updatedAt: new Date() }).where(eq(products.id, id));
  } catch (error) {
    await del(blob.url);
    throw error;
  }
  if (current.imageUrl?.includes("blob.vercel-storage.com")) await del(current.imageUrl).catch((error) => logger.warn("blob.old_image_delete_failed", { error: String(error) }));
  return c.json({ imageUrl: blob.url });
});

admin.get("/orders", async (c) => c.json(await listOrders()));

admin.patch("/orders/:id/status", zValidator("json", statusInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const { status } = c.req.valid("json");
  const [updated] = await getDb().update(orders).set({ status }).where(eq(orders.id, id)).returning({ id: orders.id, status: orders.status });
  if (!updated) return c.json({ error: "الطلب غير موجود" }, 404);
  return c.json(updated);
});

app.route("/admin", admin);

app.notFound((c) => c.json({ error: "المسار غير موجود" }, 404));
app.onError((error, c) => {
  logger.error("api.unhandled_error", { path: c.req.path, error: String(error) });
  return c.json({ error: "حدث خطأ غير متوقع" }, 500);
});

export default app;
