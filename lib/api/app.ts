import { randomInt } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { categories, couponRedemptions, coupons, customerProfiles, orderItems, orders, productSizes, products, subcategories, user } from "@/lib/db/schema";
import { imageStorage, InvalidImageError, MAX_IMAGE_SIZE } from "@/lib/image-storage";
import { logger } from "@/lib/logger";
import { listOrders, listProducts } from "@/domains/catalog/repository";
import { listCatalogHierarchy } from "@/domains/admin/repository";
import { listCoupons, resolveCoupon } from "@/domains/coupons/repository";
import { categoryInput, claimOrderInput, couponInput, couponValidationInput, customerStatusInput, orderInput, productInput, profileInput, sizeInput, statusInput, subcategoryInput } from "./schemas";

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

app.post("/coupons/validate", zValidator("json", couponValidationInput, validationHook), async (c) => {
  const { code, subtotal } = c.req.valid("json");
  const result = await resolveCoupon(code, subtotal);
  if (!result.valid) return c.json({ error: result.error }, 422);
  return c.json({ code: result.coupon.code, discount: result.discount, description: result.coupon.description });
});

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
  const coupon = input.couponCode ? await resolveCoupon(input.couponCode, subtotal) : null;
  if (coupon && !coupon.valid) return c.json({ error: coupon.error }, 422);
  const discountAmount = coupon?.valid ? coupon.discount : 0;
  const deliveryFee = Number(process.env.DELIVERY_FEE ?? 0);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const orderNumber = `TG-${Date.now().toString(36).toUpperCase()}${randomInt(100, 999)}`;

  await db.transaction(async (tx) => {
    const [created] = await tx.insert(orders).values({
      userId: current?.user.id ?? null, orderNumber, firstName: input.firstName, lastName: input.lastName, phone: input.phone,
      city: input.city, address: input.address, notes: input.notes || null, paymentMethod: "cod",
      subtotal: subtotal.toFixed(2), couponCode: coupon?.valid ? coupon.coupon.code : null,
      discountAmount: discountAmount.toFixed(2), deliveryFee: deliveryFee.toFixed(2), total: total.toFixed(2), status: "new",
    }).returning({ id: orders.id });
    await tx.insert(orderItems).values(validItems.map((item) => ({
      orderId: created.id, productId: item.productId, productName: item.productName,
      sizeLabel: item.sizeLabel, unitPrice: item.priceNumber.toFixed(2), quantity: item.quantity,
    })));
    if (coupon?.valid) {
      await tx.insert(couponRedemptions).values({
        couponId: coupon.coupon.id,
        orderId: created.id,
        userId: current?.user.id ?? null,
        code: coupon.coupon.code,
        discountAmount: discountAmount.toFixed(2),
      });
      await tx.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1`, updatedAt: new Date() }).where(eq(coupons.id, coupon.coupon.id));
    }
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

  return c.json({ orderNumber, subtotal, discountAmount, deliveryFee, total }, 201);
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
  if (current.user.role !== "admin") return c.json({ error: "ليس لديك صلاحية الإدارة" }, 401);
  c.set("admin", { id: current.user.id, name: current.user.name, email: current.user.email });
  await next();
});

admin.get("/products", async (c) => c.json(await listProducts(false)));
admin.get("/categories", async (c) => c.json(await listCatalogHierarchy()));

async function resolveProductCategory(categoryId?: number | null, subcategoryId?: number | null) {
  if (!categoryId) return null;
  const db = getDb();
  const [category] = await db.select({ id: categories.id, nameAr: categories.nameAr }).from(categories).where(eq(categories.id, categoryId)).limit(1);
  if (!category) return null;
  if (subcategoryId) {
    const [subcategory] = await db.select({ id: subcategories.id }).from(subcategories).where(and(eq(subcategories.id, subcategoryId), eq(subcategories.categoryId, categoryId))).limit(1);
    if (!subcategory) return null;
  }
  return category;
}

admin.post("/products", zValidator("json", productInput.extend({ size: sizeInput }), validationHook), async (c) => {
  const input = c.req.valid("json");
  const db = getDb();
  const category = await resolveProductCategory(input.categoryId, input.subcategoryId);
  if (input.categoryId && !category) return c.json({ error: "الفئة أو الفئة الفرعية غير صالحة" }, 422);
  const created = await db.transaction(async (tx) => {
    const [product] = await tx.insert(products).values({
      nameAr: input.nameAr, nameEn: input.nameEn, category: category?.nameAr ?? input.category, categoryId: input.categoryId ?? null, subcategoryId: input.subcategoryId ?? null, emoji: input.emoji,
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
  const category = await resolveProductCategory(input.categoryId, input.subcategoryId);
  if (input.categoryId && !category) return c.json({ error: "الفئة أو الفئة الفرعية غير صالحة" }, 422);
  const [updated] = await getDb().update(products).set({ ...input, category: category?.nameAr ?? input.category, categoryId: input.categoryId ?? null, subcategoryId: input.subcategoryId ?? null, updatedAt: new Date() }).where(eq(products.id, id)).returning();
  if (!updated) return c.json({ error: "المنتج غير موجود" }, 404);
  return c.json(updated);
});

admin.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "معرّف المنتج غير صالح" }, 400);
  const [deleted] = await getDb().delete(products).where(eq(products.id, id)).returning({ id: products.id, imageUrl: products.imageUrl });
  if (!deleted) return c.json({ error: "المنتج غير موجود" }, 404);
  await imageStorage.remove(deleted.imageUrl).catch((error) => logger.warn("image.product_delete_failed", { error: String(error) }));
  return c.json({ ok: true });
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
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    return c.json({ error: "الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 4MB" }, 422);
  }
  const [current] = await getDb().select({ imageUrl: products.imageUrl }).from(products).where(eq(products.id, id)).limit(1);
  if (!current) return c.json({ error: "المنتج غير موجود" }, 404);
  let imageUrl: string;
  try {
    imageUrl = await imageStorage.save({ namespace: "products", ownerId: id, file });
  } catch (error) {
    if (error instanceof InvalidImageError) return c.json({ error: error.message }, 422);
    throw error;
  }
  try {
    await getDb().update(products).set({ imageUrl, updatedAt: new Date() }).where(eq(products.id, id));
  } catch (error) {
    await imageStorage.remove(imageUrl).catch((cleanupError) => logger.warn("image.product_upload_rollback_failed", { error: String(cleanupError) }));
    throw error;
  }
  await imageStorage.remove(current.imageUrl).catch((error) => logger.warn("image.old_product_image_delete_failed", { error: String(error) }));
  return c.json({ imageUrl });
});

admin.post("/categories", zValidator("json", categoryInput, validationHook), async (c) => {
  const [created] = await getDb().insert(categories).values(c.req.valid("json")).returning();
  return c.json(created, 201);
});

admin.patch("/categories/:id", zValidator("json", categoryInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const [updated] = await getDb().update(categories).set({ ...c.req.valid("json"), updatedAt: new Date() }).where(eq(categories.id, id)).returning();
  if (!updated) return c.json({ error: "الفئة غير موجودة" }, 404);
  await getDb().update(products).set({ category: updated.nameAr, updatedAt: new Date() }).where(eq(products.categoryId, id));
  return c.json(updated);
});

admin.delete("/categories/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [product] = await getDb().select({ id: products.id }).from(products).where(eq(products.categoryId, id)).limit(1);
  const [child] = await getDb().select({ id: subcategories.id }).from(subcategories).where(eq(subcategories.categoryId, id)).limit(1);
  if (product || child) return c.json({ error: "انقل المنتجات واحذف الفئات الفرعية أولاً" }, 409);
  const [deleted] = await getDb().delete(categories).where(eq(categories.id, id)).returning({ imageUrl: categories.imageUrl });
  if (!deleted) return c.json({ error: "الفئة غير موجودة" }, 404);
  await imageStorage.remove(deleted.imageUrl).catch((error) => logger.warn("image.category_delete_failed", { error: String(error) }));
  return c.json({ ok: true });
});

admin.post("/categories/:id/image", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.raw.formData();
  const file = body.get("file");
  if (!(file instanceof File)) return c.json({ error: "اختر صورة" }, 422);
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size <= 0 || file.size > MAX_IMAGE_SIZE) return c.json({ error: "الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 4MB" }, 422);
  const [current] = await getDb().select({ imageUrl: categories.imageUrl }).from(categories).where(eq(categories.id, id)).limit(1);
  if (!current) return c.json({ error: "الفئة غير موجودة" }, 404);
  let imageUrl: string;
  try {
    imageUrl = await imageStorage.save({ namespace: "categories", ownerId: id, file });
  } catch (error) {
    if (error instanceof InvalidImageError) return c.json({ error: error.message }, 422);
    throw error;
  }
  try { await getDb().update(categories).set({ imageUrl, updatedAt: new Date() }).where(eq(categories.id, id)); }
  catch (error) {
    await imageStorage.remove(imageUrl).catch((cleanupError) => logger.warn("image.category_upload_rollback_failed", { error: String(cleanupError) }));
    throw error;
  }
  await imageStorage.remove(current.imageUrl).catch((error) => logger.warn("image.old_category_image_delete_failed", { error: String(error) }));
  return c.json({ imageUrl });
});

admin.post("/subcategories", zValidator("json", subcategoryInput, validationHook), async (c) => {
  const [created] = await getDb().insert(subcategories).values(c.req.valid("json")).returning();
  return c.json(created, 201);
});

admin.patch("/subcategories/:id", zValidator("json", subcategoryInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const [updated] = await getDb().update(subcategories).set({ ...c.req.valid("json"), updatedAt: new Date() }).where(eq(subcategories.id, id)).returning();
  if (!updated) return c.json({ error: "الفئة الفرعية غير موجودة" }, 404);
  return c.json(updated);
});

admin.delete("/subcategories/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [product] = await getDb().select({ id: products.id }).from(products).where(eq(products.subcategoryId, id)).limit(1);
  if (product) return c.json({ error: "انقل المنتجات من الفئة الفرعية أولاً" }, 409);
  const [deleted] = await getDb().delete(subcategories).where(eq(subcategories.id, id)).returning({ id: subcategories.id });
  if (!deleted) return c.json({ error: "الفئة الفرعية غير موجودة" }, 404);
  return c.json({ ok: true });
});

admin.get("/orders", async (c) => c.json(await listOrders()));

admin.patch("/orders/:id/status", zValidator("json", statusInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const { status } = c.req.valid("json");
  const [updated] = await getDb().update(orders).set({ status }).where(eq(orders.id, id)).returning({ id: orders.id, status: orders.status });
  if (!updated) return c.json({ error: "الطلب غير موجود" }, 404);
  return c.json(updated);
});

admin.get("/coupons", async (c) => c.json(await listCoupons()));

admin.post("/coupons", zValidator("json", couponInput, validationHook), async (c) => {
  const input = c.req.valid("json");
  const code = input.code.toUpperCase();
  const [existing] = await getDb().select({ id: coupons.id }).from(coupons).where(eq(coupons.code, code)).limit(1);
  if (existing) return c.json({ error: "رمز الخصم مستخدم مسبقاً" }, 409);
  const [created] = await getDb().insert(coupons).values({
    ...input,
    code,
    discountValue: input.discountValue.toFixed(2),
    minSubtotal: input.minSubtotal.toFixed(2),
    usageLimit: input.usageLimit ?? null,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
  }).returning();
  return c.json(created, 201);
});

admin.patch("/coupons/:id", zValidator("json", couponInput, validationHook), async (c) => {
  const id = Number(c.req.param("id"));
  const input = c.req.valid("json");
  const code = input.code.toUpperCase();
  const [conflict] = await getDb().select({ id: coupons.id }).from(coupons).where(eq(coupons.code, code)).limit(1);
  if (conflict && conflict.id !== id) return c.json({ error: "رمز الخصم مستخدم مسبقاً" }, 409);
  const [updated] = await getDb().update(coupons).set({
    ...input,
    code,
    discountValue: input.discountValue.toFixed(2),
    minSubtotal: input.minSubtotal.toFixed(2),
    usageLimit: input.usageLimit ?? null,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
    updatedAt: new Date(),
  }).where(eq(coupons.id, id)).returning();
  if (!updated) return c.json({ error: "رمز الخصم غير موجود" }, 404);
  return c.json(updated);
});

admin.patch("/customers/:id/status", zValidator("json", customerStatusInput, validationHook), async (c) => {
  const id = c.req.param("id");
  const { banned, reason } = c.req.valid("json");
  const [updated] = await getDb().update(user).set({
    banned,
    banReason: banned ? reason || "أوقفه مدير المتجر" : null,
    banExpires: null,
    updatedAt: new Date(),
  }).where(and(eq(user.id, id), ne(user.role, "admin"))).returning({ id: user.id, banned: user.banned });
  if (!updated) return c.json({ error: "العميل غير موجود" }, 404);
  return c.json(updated);
});

app.route("/admin", admin);

app.notFound((c) => c.json({ error: "المسار غير موجود" }, 404));
app.onError((error, c) => {
  logger.error("api.unhandled_error", { path: c.req.path, error: String(error) });
  return c.json({ error: "حدث خطأ غير متوقع" }, 500);
});

export default app;
