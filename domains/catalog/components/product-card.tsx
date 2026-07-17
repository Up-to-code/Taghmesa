"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types";
import { plainTextFromRichText } from "@/lib/rich-text";
import { useCart } from "@/domains/cart/cart-context";
import { StoreIcon } from "@/components/shared/store-icon";
import { animateProductToCart } from "../animate-product-to-cart";
import { ProductFlavorStamp } from "./catalog-flavor-art";

export function ProductCard({ product, priority = false, variant = "grid" }: { product: Product; priority?: boolean; variant?: "grid" | "search" | "mobile-list" }) {
  const [sizeIndex, setSizeIndex] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const { items, add, changeQuantity } = useCart();
  const size = product.sizes[sizeIndex];
  if (!size) return null;
  const cartKey = `${product.id}-${size.id}`;
  const cartItem = items.find((item) => item.key === cartKey);

  function addToCart() {
    animateProductToCart(mediaRef.current, 1);
    add(product, size);
  }

  function increaseQuantity() {
    animateProductToCart(mediaRef.current, (cartItem?.quantity ?? 0) + 1);
    changeQuantity(cartKey, 1);
  }

  const cartControl = cartItem ? <div className="image-quantity-control" role="group" aria-label={`كمية ${product.nameAr}، ${size.label}`}>
    <button type="button" onClick={() => changeQuantity(cartKey, -1)} aria-label={`تقليل كمية ${product.nameAr}`}><StoreIcon name="minus" size={14}/></button>
    <output aria-live="polite" aria-label={`الكمية ${cartItem.quantity}`}>{cartItem.quantity}</output>
    <button type="button" onClick={increaseQuantity} aria-label={`زيادة كمية ${product.nameAr}`}><StoreIcon name="plus" size={14}/></button>
  </div> : <button className="image-add-button" onClick={addToCart} aria-label={`أضف للسلة: ${product.nameAr}، ${size.label}`}>
    <StoreIcon name="plus" size={15}/><span>أضف للسلة</span>
  </button>;

  const variantClass = variant === "search" ? " search-product-card" : variant === "mobile-list" ? " mobile-list-product-card" : "";
  return <article className={`product-card${variantClass}`}>
    <Link className="product-card-hit-area" href={`/products/${product.id}`} aria-label={`اعرف المزيد عن ${product.nameAr}`}/>
    <div className="product-media" ref={mediaRef}>
      <div className={product.imageUrl ? "product-image" : "product-image product-placeholder"}>
        {product.imageUrl ? <Image src={product.imageUrl} alt={product.nameAr} fill priority={priority} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"/> : <span className="product-emoji">{product.emoji}</span>}
        {variant === "grid" && <ProductFlavorStamp category={product.category}/>}
      </div>
      <div className="product-overlay-badges">
        <span className="category-badge">{product.category}</span>
        <span className="calorie-badge"><StoreIcon name="flame" size={13}/>{size.caloriesLabel}</span>
        {product.isNew && <b className="new-badge">جديد</b>}
      </div>
    </div>
    <div className="product-body">
      <h3>{product.nameAr}</h3>
      <small className="product-en">{product.nameEn}</small>
      <p>{plainTextFromRichText(product.description)}</p>
      <div className="product-choice-row">
        <span>اختر الكمية</span>
        <div className="size-options" aria-label={`اختر كمية ${product.nameAr}`}>{product.sizes.map((candidate, index) => <button type="button" key={candidate.id} className={index === sizeIndex ? "active" : ""} onClick={() => setSizeIndex(index)} aria-pressed={index === sizeIndex}>{candidate.label}</button>)}</div>
      </div>
      <div className="product-foot"><div className="product-price"><strong>{size.price}</strong> <span>ر.س</span></div><div className="product-card-cart">{cartControl}</div></div>
    </div>
  </article>;
}
