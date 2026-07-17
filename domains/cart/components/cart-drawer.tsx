"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { StoreIcon } from "@/components/shared/store-icon";
import { useCart } from "../cart-context";

export function CartDrawer() {
  const { items, total, drawerOpen, closeDrawer, remove, changeQuantity } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const drawer = drawerRef.current;
    if (!overlay || !backdrop || !drawer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileSheet = window.matchMedia("(max-width: 639px)").matches;
    const hiddenPosition = mobileSheet ? { yPercent: 18, xPercent: 0 } : { xPercent: 105, yPercent: 0 };
    if (reduceMotion) {
      if (drawerOpen) {
        gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(backdrop, { autoAlpha: 1 });
        gsap.set(drawer, { xPercent: 0, yPercent: 0 });
        closeRef.current?.focus();
      } else {
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(drawer, hiddenPosition);
      }
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (drawerOpen) closeRef.current?.focus();
      },
    });

    if (drawerOpen) {
      timeline
        .set(overlay, { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 0)
        .fromTo(drawer, { ...hiddenPosition, autoAlpha: mobileSheet ? 0.7 : 1 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: mobileSheet ? 0.22 : 0.42 }, 0);
    } else {
      timeline
        .to(drawer, { ...hiddenPosition, autoAlpha: mobileSheet ? 0.7 : 1, duration: mobileSheet ? 0.18 : 0.3, ease: "power3.in" }, 0)
        .to(backdrop, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0.08)
        .set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    }

    return () => { timeline.kill(); };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [drawerOpen, closeDrawer]);

  return <div id="store-cart" ref={overlayRef} className="cart-overlay" role="dialog" aria-modal="true" aria-label="سلة التسوق" aria-hidden={!drawerOpen} inert={!drawerOpen}>
    <button ref={backdropRef} className="cart-backdrop" aria-label="إغلاق السلة" onClick={closeDrawer} tabIndex={drawerOpen ? 0 : -1} />
    <aside ref={drawerRef} className="cart-drawer">
      <span className="cart-sheet-handle" aria-hidden="true"/>
      <div className="cart-head"><strong><StoreIcon name="cart"/> سلتك</strong><button ref={closeRef} className="icon-button" onClick={closeDrawer} aria-label="إغلاق"><StoreIcon name="close"/></button></div>
      <div className="cart-items">
        {!items.length && <div className="empty-state"><span><StoreIcon name="cart" size={52}/></span><strong>السلة فارغة</strong><small>أضف منتجات من المتجر</small></div>}
        {items.map((item) => <article className="cart-item" key={item.key}>
          <div className="cart-thumb">{item.imageUrl ? <Image src={item.imageUrl} alt="" width={62} height={62} style={{ width: "100%", height: "100%" }}/> : item.emoji}</div>
          <div className="cart-item-info"><strong>{item.nameAr}</strong><small>{item.sizeLabel}</small><b>{item.price} ر.س</b>
            <div className="quantity"><button onClick={() => changeQuantity(item.key, -1)} aria-label="تقليل الكمية">−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.key, 1)} aria-label="زيادة الكمية">+</button></div>
          </div>
          <button className="remove-button" onClick={() => remove(item.key)} aria-label={`حذف ${item.nameAr}`}>✕</button>
        </article>)}
      </div>
      {!!items.length && <div className="cart-footer"><div><span>الإجمالي</span><strong>{total.toFixed(2)} ر.س</strong></div><Link href="/checkout" onClick={closeDrawer} className="primary-button full">إتمام الطلب</Link></div>}
    </aside>
  </div>;
}
