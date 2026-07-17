"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { StoreIcon } from "@/components/shared/store-icon";

const slides = [
  { image: "/products/8.webp", eyebrow: "مختارات تغميسة", title: "نكهات بيتية طازجة", copy: "محضّرة يومياً بعناية", href: "/shop?category=غموس", tone: "clay" },
  { image: "/products/1.webp", eyebrow: "الأكثر طلباً", title: "أطباق لسفرتك", copy: "وصفات أصيلة للمشاركة", href: "/shop?category=مطبوخ", tone: "teal" },
  { image: "/products/7.webp", eyebrow: "حلاها معنا", title: "حلى بطعم البيت", copy: "اختيارات تناسب كل مناسبة", href: "/shop?category=حلويات", tone: "gold" },
] as const;

export function HomeHeroCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; scrollLeft: number; index: number } | null>(null);
  const settleTween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index: number) => {
    const viewport = viewportRef.current;
    const slide = viewport?.children[index] as HTMLElement | undefined;
    if (!viewport || !slide) return;

    const viewportRect = viewport.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const target = viewport.scrollLeft + (slideRect.left + slideRect.width / 2) - (viewportRect.left + viewportRect.width / 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    settleTween.current?.kill();
    viewport.classList.remove("is-dragging");
    viewport.classList.add("is-settling");
    settleTween.current = gsap.to(viewport, {
      scrollLeft: target,
      duration: reduceMotion ? 0 : 0.42,
      ease: "power3.out",
      overwrite: true,
      onComplete: () => {
        viewport.classList.remove("is-settling");
        setActive(index);
      },
    });
  };

  const getNearestIndex = () => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    return Array.from(viewport.children).reduce((best, child, index) => {
      const rect = child.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => goTo((active + 1) % slides.length), 4500);
    return () => window.clearInterval(timer);
  }, [active, paused]);

  useEffect(() => {
    return () => {
      if (settleTween.current) settleTween.current.kill();
    };
  }, []);

  const updateActiveSlide = () => {
    const viewport = viewportRef.current;
    if (viewport?.classList.contains("is-dragging") || viewport?.classList.contains("is-settling")) return;
    setActive(getNearestIndex());
  };

  return <section className="mobile-hero-carousel" aria-label="مختارات تغميسة" aria-roledescription="carousel">
    <div
      ref={viewportRef}
      className="mobile-carousel-viewport"
      onScroll={updateActiveSlide}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        setPaused(true);
        settleTween.current?.kill();
        event.currentTarget.classList.remove("is-settling");
        event.currentTarget.classList.add("is-dragging");
        dragStart.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, index: active };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragStart.current) return;
        event.currentTarget.scrollLeft = dragStart.current.scrollLeft - (event.clientX - dragStart.current.x) * 1.15;
      }}
      onPointerUp={(event) => {
        const start = dragStart.current;
        if (!start) return;
        const distance = event.clientX - start.x;
        const targetIndex = Math.abs(distance) > 28
          ? Math.max(0, Math.min(slides.length - 1, start.index + (distance > 0 ? 1 : -1)))
          : getNearestIndex();
        dragStart.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        goTo(targetIndex);
      }}
      onPointerCancel={(event) => {
        dragStart.current = null;
        event.currentTarget.classList.remove("is-dragging");
        goTo(getNearestIndex());
      }}
    >
      {slides.map((slide, index) => <article className={`mobile-carousel-slide tone-${slide.tone}`} key={slide.title} aria-label={`${index + 1} من ${slides.length}`} aria-hidden={active !== index}>
        <div><small>{slide.eyebrow}</small><strong>{slide.title}</strong><p>{slide.copy}</p><Link href={slide.href} tabIndex={active === index ? 0 : -1}>تصفح الآن</Link></div>
        <Image src={slide.image} alt="" width={210} height={180} priority={index === 0}/>
      </article>)}
    </div>
    <div className="mobile-carousel-controls">
      <button className="carousel-pause" onClick={() => setPaused((current) => !current)} aria-label={paused ? "تشغيل العرض التلقائي" : "إيقاف العرض التلقائي"}><StoreIcon name={paused ? "play" : "pause"} size={15}/></button>
      <div>{slides.map((slide, index) => <button key={slide.title} className={active === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`عرض الشريحة ${index + 1}`} aria-current={active === index ? "true" : undefined}/>)}</div>
    </div>
  </section>;
}
