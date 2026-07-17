import { z } from "zod";

export const orderInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(1).max(80),
  address: z.string().trim().min(3).max(1000),
  notes: z.string().trim().max(2000).optional().default(""),
  paymentMethod: z.literal("cod"),
  items: z.array(z.object({ productId: z.number().int().positive(), sizeId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })).min(1).max(100),
});

export const productInput = z.object({
  nameAr: z.string().trim().min(1).max(120), nameEn: z.string().trim().max(120).default(""),
  category: z.string().trim().min(1).max(40), emoji: z.string().trim().max(20).default("🍽️"),
  description: z.string().trim().max(4000).default(""), isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false), isNew: z.boolean().default(false), sortOrder: z.number().int().default(999),
});
export const sizeInput = z.object({ label: z.string().trim().min(1).max(60), price: z.number().min(0).max(999999), caloriesLabel: z.string().trim().max(60).default(""), sortOrder: z.number().int().default(99) });
export const statusInput = z.object({ status: z.enum(["new", "preparing", "out_for_delivery", "delivered", "cancelled"]) });

export const profileInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(1).max(80),
  address: z.string().trim().min(3).max(1000),
});

export const claimOrderInput = z.object({
  orderNumber: z.string().trim().min(4).max(24),
  phone: z.string().trim().min(7).max(20),
});
