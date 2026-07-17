"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, ProductSize } from "@/domains/catalog/types";
import { logger } from "@/lib/logger";

export type CartItem = { key: string; productId: number; sizeId: number; nameAr: string; emoji: string; imageUrl: string | null; sizeLabel: string; price: number; quantity: number };
type CartContextValue = {
  items: CartItem[]; count: number; total: number; drawerOpen: boolean; toast: string | null; ready: boolean;
  add: (product: Product, size: ProductSize) => void; remove: (key: string) => void;
  changeQuantity: (key: string, delta: number) => void; clear: () => void;
  openDrawer: () => void; closeDrawer: () => void; showToast: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "taghmesa-cart-v1";

function isStoredCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return typeof item.key === "string" && typeof item.productId === "number" && typeof item.sizeId === "number"
    && typeof item.nameAr === "string" && typeof item.emoji === "string" && (item.imageUrl === null || typeof item.imageUrl === "string")
    && typeof item.sizeLabel === "string" && typeof item.price === "number" && Number.isFinite(item.price)
    && typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let restoredItems: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (Array.isArray(saved)) restoredItems = saved.filter(isStoredCartItem);
      }
    } catch (error) {
      logger.warn("cart.restore_failed", { error: String(error) });
    }

    const frame = window.requestAnimationFrame(() => {
      setItems(restoredItems);
      setStorageReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      logger.warn("cart.persist_failed", { error: String(error) });
    }
  }, [items, storageReady]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => current === message ? null : current), 2800);
  }, []);

  const add = useCallback((product: Product, size: ProductSize) => {
    const key = `${product.id}-${size.id}`;
    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { key, productId: product.id, sizeId: size.id, nameAr: product.nameAr, emoji: product.emoji, imageUrl: product.imageUrl, sizeLabel: size.label, price: size.price, quantity: 1 }];
    });
    showToast(`تمت الإضافة: ${product.nameAr} – ${size.label}`);
  }, [showToast]);

  const remove = useCallback((key: string) => setItems((current) => current.filter((item) => item.key !== key)), []);
  const changeQuantity = useCallback((key: string, delta: number) => setItems((current) => current.flatMap((item) => item.key !== key ? [item] : item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : [])), []);
  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(() => ({ items, count, total, drawerOpen, toast, ready: storageReady, add, remove, changeQuantity, clear, openDrawer, closeDrawer, showToast }), [items, count, total, drawerOpen, toast, storageReady, add, remove, changeQuantity, clear, openDrawer, closeDrawer, showToast]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
