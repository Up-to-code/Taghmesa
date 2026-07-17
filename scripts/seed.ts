import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { productSizes, products, user } from "@/lib/db/schema";
import { seedProducts } from "@/domains/catalog/seed-data";

async function main() {
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!password || password.length < 8) throw new Error("Set INITIAL_ADMIN_PASSWORD to at least 8 characters before seeding");
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  if (!adminEmail) throw new Error("Set INITIAL_ADMIN_EMAIL before seeding");
  const db = getDb();
  await db.transaction(async (tx) => {
    for (const product of seedProducts) {
      await tx.insert(products).values({ id: product.id, nameAr: product.nameAr, nameEn: product.nameEn, category: product.category, emoji: product.emoji, description: product.description, imageUrl: product.imageUrl, isFeatured: product.isFeatured, isNew: product.isNew, isActive: true, sortOrder: product.id }).onConflictDoUpdate({ target: products.id, set: { nameAr: product.nameAr, nameEn: product.nameEn, category: product.category, emoji: product.emoji, description: product.description, imageUrl: product.imageUrl, isFeatured: product.isFeatured, isNew: product.isNew } });
      for (const size of product.sizes) await tx.insert(productSizes).values({ id: size.id, productId: product.id, label: size.label, price: size.price.toFixed(2), caloriesLabel: size.caloriesLabel, sortOrder: size.id }).onConflictDoUpdate({ target: productSizes.id, set: { label: size.label, price: size.price.toFixed(2), caloriesLabel: size.caloriesLabel } });
    }
    await tx.execute(sql`select setval(pg_get_serial_sequence('products','id'), coalesce(max(id), 1)) from products`);
    await tx.execute(sql`select setval(pg_get_serial_sequence('product_sizes','id'), coalesce(max(id), 1)) from product_sizes`);
  });
  const [existingAdmin] = await db.select({ id: user.id }).from(user).where(eq(user.email, adminEmail.toLowerCase())).limit(1);
  let adminId = existingAdmin?.id;
  if (!adminId) {
    const created = await auth.api.signUpEmail({ body: { name: process.env.INITIAL_ADMIN_NAME ?? "Admin", email: adminEmail, password } });
    adminId = created.user.id;
  }
  await db.update(user).set({ role: "admin", updatedAt: new Date() }).where(eq(user.id, adminId));
}

main().then(() => { process.stdout.write("Taghmesa seed complete.\n"); process.exit(0); }).catch((error) => { process.stderr.write(`${String(error)}\n`); process.exit(1); });
