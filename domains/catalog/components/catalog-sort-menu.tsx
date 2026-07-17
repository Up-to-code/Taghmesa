"use client";

import { useEffect, useRef, useState } from "react";
import type { SortMode } from "../filter-products";

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "default", label: "ترتيب افتراضي" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "name", label: "الاسم أبجدياً" },
];

export function CatalogSortMenu({ value, onChange }: { value: SortMode; onChange: (value: SortMode) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectedIndex = Math.max(0, sortOptions.findIndex((option) => option.value === value));
  const selectedOption = sortOptions[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  function openMenu() {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  }

  function closeMenu({ restoreFocus = false } = {}) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function selectOption(option: (typeof sortOptions)[number]) {
    onChange(option.value);
    closeMenu({ restoreFocus: true });
  }

  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (event.key === "Home") setActiveIndex(0);
      else if (event.key === "End") setActiveIndex(sortOptions.length - 1);
      else setActiveIndex((current) => (current + (event.key === "ArrowDown" ? 1 : -1) + sortOptions.length) % sortOptions.length);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(sortOptions[activeIndex]);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
    if (event.key === "Tab") closeMenu();
  }

  return <div className={`catalog-sort-menu${isOpen ? " open" : ""}`}>
    <button
      ref={triggerRef}
      className="catalog-sort-trigger"
      type="button"
      aria-label={`ترتيب المنتجات: ${selectedOption.label}`}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls="catalog-sort-options"
      onClick={() => isOpen ? closeMenu() : openMenu()}
      onKeyDown={(event) => {
        if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          openMenu();
        }
        if (isOpen && event.key === "Escape") {
          event.preventDefault();
          closeMenu({ restoreFocus: true });
        }
      }}
    >
      <span>{selectedOption.label}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
    </button>
    {isOpen && <>
      <div className="catalog-sort-dismiss" aria-hidden="true" onPointerDown={() => closeMenu()}/>
      <div id="catalog-sort-options" className="catalog-sort-options" role="listbox" aria-label="ترتيب المنتجات">
        {sortOptions.map((option, index) => <div
          key={option.value}
          ref={(node) => { optionRefs.current[index] = node; }}
          id={`catalog-sort-${option.value}`}
          className={index === selectedIndex ? "selected" : ""}
          role="option"
          tabIndex={index === activeIndex ? 0 : -1}
          aria-selected={index === selectedIndex}
          onClick={() => selectOption(option)}
          onKeyDown={handleOptionKeyDown}
        >
          <span>{option.label}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 2.8 2.8 6.2-6.2"/></svg>
        </div>)}
      </div>
    </>}
  </div>;
}
