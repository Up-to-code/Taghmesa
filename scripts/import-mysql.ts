import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { adminUsers, orderItems, orders, productSizes, products } from "@/lib/db/schema";

interface Row extends RowDataPacket { [key: string]: unknown }
const value = (row: Row, key: string) => row[key] as never;

async function main() {
  if (!process.env.SOURCE_DATABASE_URL) throw new Error("SOURCE_DATABASE_URL is required");
  const source = await mysql.createConnection(process.env.SOURCE_DATABASE_URL);
  const [productRows] = await source.query<Row[]>("SELECT * FROM products ORDER BY id");
  const [sizeRows] = await source.query<Row[]>("SELECT * FROM product_sizes ORDER BY id");
  const [orderRows] = await source.query<Row[]>("SELECT * FROM orders ORDER BY id");
  const [itemRows] = await source.query<Row[]>("SELECT * FROM order_items ORDER BY id");
  const [adminRows] = await source.query<Row[]>("SELECT * FROM admin_users ORDER BY id");
  await source.end();
  const db = getDb();
  await db.transaction(async (tx) => {
    for (const row of productRows) await tx.insert(products).values({ id: value(row,"id"), nameAr: value(row,"name_ar"), nameEn: value(row,"name_en"), category: value(row,"category"), emoji: value(row,"emoji"), description: value(row,"description"), imageUrl: row.image_path ? `/products/${row.id}.${String(row.image_path).split(".").pop()}` : null, isFeatured: Boolean(row.is_featured), isNew: Boolean(row.is_new), isActive: Boolean(row.is_active), sortOrder: value(row,"sort_order"), createdAt: value(row,"created_at"), updatedAt: value(row,"updated_at") }).onConflictDoNothing();
    for (const row of sizeRows) await tx.insert(productSizes).values({ id: value(row,"id"), productId: value(row,"product_id"), label: value(row,"label"), price: String(row.price), caloriesLabel: value(row,"calories_label"), sortOrder: value(row,"sort_order") }).onConflictDoNothing();
    for (const row of orderRows) await tx.insert(orders).values({ id: value(row,"id"), orderNumber: value(row,"order_number"), firstName: value(row,"first_name"), lastName: value(row,"last_name"), phone: value(row,"phone"), city: value(row,"city"), address: value(row,"address"), notes: row.notes ? String(row.notes) : null, paymentMethod: "cod", subtotal: String(row.subtotal), deliveryFee: String(row.delivery_fee), total: String(row.total), status: value(row,"status"), createdAt: value(row,"created_at") }).onConflictDoNothing();
    for (const row of itemRows) await tx.insert(orderItems).values({ id: value(row,"id"), orderId: value(row,"order_id"), productId: row.product_id ? Number(row.product_id) : null, productName: value(row,"product_name"), sizeLabel: value(row,"size_label"), unitPrice: String(row.unit_price), quantity: value(row,"qty") }).onConflictDoNothing();
    for (const row of adminRows) await tx.insert(adminUsers).values({ id: value(row,"id"), username: value(row,"username"), passwordHash: value(row,"password_hash"), createdAt: value(row,"created_at") }).onConflictDoNothing();
    for (const table of ["products", "product_sizes", "orders", "order_items", "admin_users"]) await tx.execute(sql.raw(`select setval(pg_get_serial_sequence('${table}','id'), coalesce((select max(id) from ${table}), 1))`));
  });
}

main().then(() => { process.stdout.write("MySQL import complete. Upload legacy product images to Vercel Blob or retain the static /products fallbacks.\n"); process.exit(0); }).catch((error) => { process.stderr.write(`${String(error)}\n`); process.exit(1); });
