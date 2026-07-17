import { z } from "zod";

export const orderInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(1).max(80),
  address: z.string().trim().min(3).max(1000),
  notes: z.string().trim().max(2000).optional().default(""),
  couponCode: z.string().trim().max(40).optional().default(""),
  paymentMethod: z.literal("cod"),
  items: z.array(z.object({ productId: z.number().int().positive(), sizeId: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })).min(1).max(100),
});

export const couponValidationInput = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.number().min(0).max(999999),
});

export const couponInput = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/),
  description: z.string().trim().max(240).default(""),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive().max(999999),
  minSubtotal: z.number().min(0).max(999999).default(0),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

export const customerStatusInput = z.object({
  banned: z.boolean(),
  reason: z.string().trim().max(240).optional().default(""),
});

export const productInput = z.object({
  nameAr: z.string().trim().min(1).max(120), nameEn: z.string().trim().max(120).default(""),
  category: z.string().trim().min(1).max(40), emoji: z.string().trim().max(20).default("🍽️"),
  description: z.string().trim().max(4000).default(""), isActive: z.boolean().default(true),
  categoryId: z.number().int().positive().nullable().optional(), subcategoryId: z.number().int().positive().nullable().optional(),
  isFeatured: z.boolean().default(false), isNew: z.boolean().default(false), sortOrder: z.number().int().default(999),
});
export const sizeInput = z.object({ label: z.string().trim().min(1).max(60), price: z.number().min(0).max(999999), caloriesLabel: z.string().trim().max(60).default(""), sortOrder: z.number().int().default(99) });
export const statusInput = z.object({ status: z.enum(["new", "preparing", "out_for_delivery", "delivered", "cancelled"]) });
export const categoryInput = z.object({
  nameAr: z.string().trim().min(1).max(80), nameEn: z.string().trim().max(80).default(""),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/), isActive: z.boolean().default(true), sortOrder: z.number().int().default(0),
});
export const subcategoryInput = categoryInput.omit({ isActive: true }).extend({ categoryId: z.number().int().positive(), isActive: z.boolean().default(true) });

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
