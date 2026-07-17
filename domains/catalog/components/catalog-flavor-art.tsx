import type { ReactNode } from "react";

const productMotifs: Record<string, ReactNode> = {
  "مطبوخ": <><path d="M11 38c5-12 13-21 26-28"/><path d="M18 29c-6 0-10-3-11-8 6-1 11 1 13 5M27 20c0-6 3-10 9-12 1 6-1 11-6 14M13 35c-4 0-7-2-9-5 4-2 8-1 11 2"/></>,
  "غموس": <><path d="M8 25c5 11 27 12 32 0"/><path d="M7 22h34M13 16c4-5 10-7 17-5 4 1 7 4 8 7"/><path d="M22 15c3 0 6 1 8 4"/></>,
  "حلويات": <><path d="M24 5c1 8 5 12 13 13-8 1-12 5-13 13-1-8-5-12-13-13 8-1 12-5 13-13Z"/><path d="M37 29c.5 4 2.5 6 6.5 6.5-4 .5-6 2.5-6.5 6.5-.5-4-2.5-6-6.5-6.5 4-.5 6-2.5 6.5-6.5Z"/></>,
  "صوصات": <><path d="M28 6c-1 7-4 11-10 16-5 4-7 8-5 14 2 7 10 10 17 8 8-3 11-11 8-18-2-5-6-8-10-20Z"/><path d="M20 35c3 3 7 3 10 0"/></>,
};

export function CatalogIntroDoodles() {
  return <div className="catalog-intro-doodles" aria-hidden="true">
    <svg className="catalog-intro-doodle doodle-citrus" viewBox="0 0 72 72"><circle cx="36" cy="36" r="25"/><path d="M36 11v50M11 36h50M18 18l36 36M54 18 18 54"/><circle cx="36" cy="36" r="4"/></svg>
    <svg className="catalog-intro-doodle doodle-leaf" viewBox="0 0 84 64"><path d="M5 56c19-14 36-28 54-48"/><path d="M20 44C9 43 5 36 7 28c11-1 18 4 18 11M37 31c-1-11 5-18 15-20 3 10-1 18-11 23M53 17c2-8 8-12 16-11 0 8-4 13-12 15"/></svg>
    <svg className="catalog-intro-doodle doodle-chilli" viewBox="0 0 92 54"><path d="M12 17c18 3 30-2 44-11-2 10 4 18 19 25-14 15-38 15-53 2-5-4-8-10-10-16Z"/><path d="M56 7c9-6 17-5 24 1"/><path d="M24 27c8 7 18 9 29 5"/></svg>
    <svg className="catalog-intro-trail" viewBox="0 0 560 94" preserveAspectRatio="none"><path d="M9 69c79-56 146 23 227-17 67-33 116 17 172-2 47-15 78-39 143-29"/><circle cx="10" cy="69" r="4"/><circle cx="551" cy="21" r="4"/></svg>
  </div>;
}

export function HeroFlavorDoodles() {
  return <div className="hero-flavor-doodles" aria-hidden="true">
    <svg className="hero-doodle hero-doodle-citrus" viewBox="0 0 72 72"><circle cx="36" cy="36" r="25"/><path d="M36 11v50M11 36h50M18 18l36 36M54 18 18 54"/><circle cx="36" cy="36" r="4"/></svg>
    <svg className="hero-doodle hero-doodle-leaf" viewBox="0 0 84 64"><path d="M5 56c19-14 36-28 54-48"/><path d="M20 44C9 43 5 36 7 28c11-1 18 4 18 11M37 31c-1-11 5-18 15-20 3 10-1 18-11 23M53 17c2-8 8-12 16-11 0 8-4 13-12 15"/></svg>
    <svg className="hero-doodle hero-doodle-chilli" viewBox="0 0 92 54"><path d="M12 17c18 3 30-2 44-11-2 10 4 18 19 25-14 15-38 15-53 2-5-4-8-10-10-16Z"/><path d="M56 7c9-6 17-5 24 1M24 27c8 7 18 9 29 5"/></svg>
    <svg className="hero-doodle hero-doodle-spark" viewBox="0 0 64 64"><path d="M32 5c1 16 10 25 27 27-17 2-26 11-27 27-2-16-11-25-27-27 16-2 25-11 27-27Z"/><circle cx="53" cy="10" r="3"/><circle cx="10" cy="52" r="2"/></svg>
    <svg className="hero-doodle hero-doodle-bowl" viewBox="0 0 82 58"><path d="M9 25c7 24 56 25 64 0H9Z"/><path d="M15 21c13-12 40-13 54 0M25 12c6-5 13-7 21-6M32 43c7 4 15 4 22 0"/></svg>
    <svg className="hero-doodle hero-doodle-spoon" viewBox="0 0 76 76"><ellipse cx="21" cy="19" rx="12" ry="16" transform="rotate(-35 21 19)"/><path d="m29 29 36 38"/><path d="M57 59c4 0 7 3 8 8"/></svg>
    <svg className="hero-doodle hero-doodle-tomato" viewBox="0 0 72 72"><circle cx="36" cy="39" r="24"/><path d="M36 15c-2-7 1-11 7-13M35 16c-8-7-15-6-20-1 7 0 12 3 15 8M38 17c8-7 15-6 20-1-7 0-12 3-15 8"/><path d="M24 49c7 6 17 7 25 2"/></svg>
    <svg className="hero-doodle-trail" viewBox="0 0 1100 420" preserveAspectRatio="none"><path d="M18 306c109-98 204 57 324-25 101-69 186 41 279-13 108-62 204 45 301-31 54-43 102-61 159-45"/><circle cx="18" cy="306" r="5"/><circle cx="1081" cy="192" r="5"/></svg>
  </div>;
}

export function ProductFlavorStamp({ category }: { category: string }) {
  return <span className={`product-flavor-stamp flavor-${category}`} aria-hidden="true">
    <svg viewBox="0 0 48 48">{productMotifs[category] ?? productMotifs["مطبوخ"]}</svg>
  </span>;
}
