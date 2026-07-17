"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  imageUrl: string | null;
  name: string;
  emoji: string;
  category: string;
  isNew: boolean;
};

const views = [
  { label: "الصورة الكاملة", position: "center", zoom: false },
  { label: "تفاصيل الطبق", position: "center 38%", zoom: true },
  { label: "لقطة التقديم", position: "72% center", zoom: true },
] as const;

export function ProductImageGallery({ imageUrl, name, emoji, category, isNew }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeView = views[activeIndex];

  function move(direction: number) {
    setActiveIndex((current) => (current + direction + views.length) % views.length);
  }

  return <section className="product-gallery" aria-label={`صور ${name}`}>
    <div className="product-gallery-stage">
      {imageUrl ? <Image
        key={activeIndex}
        src={imageUrl}
        alt={`${name} — ${activeView.label}`}
        fill
        priority
        sizes="(max-width: 900px) 100vw, 54vw"
        className={activeView.zoom ? "is-zoomed" : ""}
        style={{ objectPosition: activeView.position }}
      /> : <span className="product-gallery-placeholder">{emoji}</span>}
      <div className={`detail-badges category-${category}`}><b>{category}</b>{isNew && <b className="is-new">جديد</b>}</div>
      <span className="product-gallery-counter" dir="ltr">{activeIndex + 1} / {views.length}</span>
      <button className="product-gallery-arrow is-next" type="button" onClick={() => move(1)} aria-label="الصورة التالية"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="m18 6-8 8 8 8"/></svg></button>
      <button className="product-gallery-arrow is-prev" type="button" onClick={() => move(-1)} aria-label="الصورة السابقة"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="m10 6 8 8-8 8"/></svg></button>
      <div className="product-gallery-caption"><small>من مطبخ تغميسة</small><strong>{activeView.label}</strong></div>
    </div>
    <div className="product-gallery-thumbs" role="tablist" aria-label="اختيار عرض الصورة">
      {views.map((view, index) => <button key={view.label} type="button" role="tab" aria-selected={activeIndex === index} aria-label={view.label} className={activeIndex === index ? "active" : ""} onClick={() => setActiveIndex(index)}>
        <span className="product-gallery-thumb-media">{imageUrl ? <Image src={imageUrl} alt="" fill sizes="120px" style={{ objectPosition: view.position }} className={view.zoom ? "is-zoomed" : ""}/> : <i>{emoji}</i>}</span>
        <small>{view.label}</small>
      </button>)}
    </div>
  </section>;
}
