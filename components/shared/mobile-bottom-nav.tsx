"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/domains/cart/cart-context";
import { authClient } from "@/lib/auth/client";
import { StoreIcon } from "./store-icon";

const items = [
  { href: "/", label: "الرئيسية", icon: "home" },
  { href: "/shop", label: "المتجر", icon: "shop" },
  { href: "/search", label: "البحث", icon: "search" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, drawerOpen, openDrawer } = useCart();
  const { data: session } = authClient.useSession();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return <nav className="mobile-bottom-nav" aria-label="التنقل عبر التطبيق">
    {items.slice(0, 2).map((item) => <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : ""} aria-current={isActive(item.href) ? "page" : undefined}><span className="mobile-tab-icon"><StoreIcon name={item.icon} size={22}/></span><span>{item.label}</span></Link>)}
    <button className={`mobile-cart-action${drawerOpen ? " active" : ""}`} type="button" onClick={openDrawer} aria-label={count > 0 ? `السلة، ${count} منتجات` : "السلة"} aria-expanded={drawerOpen} aria-controls="store-cart"><span className="mobile-tab-icon"><StoreIcon name="cart" size={22}/>{count > 0 && <b>{count}</b>}</span><span>السلة</span></button>
    {items.slice(2).map((item) => <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : ""} aria-current={isActive(item.href) ? "page" : undefined}><span className="mobile-tab-icon"><StoreIcon name={item.icon} size={22}/></span><span>{item.label}</span></Link>)}
    <Link href={session ? "/account" : "/login"} className={pathname.startsWith("/account") ? "active" : ""} aria-current={pathname.startsWith("/account") ? "page" : undefined}><span className="mobile-tab-icon"><StoreIcon name="user" size={22}/></span><span>{session ? "حسابي" : "دخول"}</span></Link>
  </nav>;
}
