"use client";

import { useState } from "react";
import type { Product } from "../types";
import { useCart } from "@/domains/cart/cart-context";

export function ProductDetailsActions({ product }: { product: Product }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const size = product.sizes[sizeIndex];

  if (!size) return <p className="detail-unavailable">هذا المنتج غير متاح حالياً.</p>;

  function addToCart() {
    add(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return <div className="detail-actions">
    <div className="detail-size-head"><div><strong>اختر الحجم المناسب</strong><small>حدّد الكمية التي تناسب سفرتك</small></div><span>{size.caloriesLabel} تقريباً</span></div>
    <div className="detail-size-options">
      {product.sizes.map((candidate, index) => <button key={candidate.id} className={index === sizeIndex ? "active" : ""} onClick={() => setSizeIndex(index)} aria-pressed={index === sizeIndex}>
        <i aria-hidden="true">✓</i><strong>{candidate.label}</strong><span>{candidate.price} ر.س</span>
      </button>)}
    </div>
    <div className="detail-buy"><div><small>السعر الإجمالي</small><strong>{size.price} <span>ر.س</span></strong></div><button className={added ? "added" : ""} onClick={addToCart}><span aria-hidden="true">+</span>{added ? "تمت الإضافة ✓" : "أضف إلى السلة"}</button></div>
  </div>;
}
