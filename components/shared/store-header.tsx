"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/domains/cart/cart-context";
import { authClient } from "@/lib/auth/client";
import { StoreIcon } from "./store-icon";

const links = [["/", "الرئيسية"], ["/shop", "المتجر"], ["/about", "من نحن"], ["/contact", "تواصل"], ["/policies", "سياسات"]] as const;

export function StoreHeader() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const { data: session } = authClient.useSession();
  const [darkTheme, setDarkTheme] = useState(false);
  const toggleTheme = () => {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
  };
  const isActive = (href: string) => href === "/" ? pathname === "/" : href === "/shop" ? pathname.startsWith("/shop") || pathname.startsWith("/products/") : pathname.startsWith(href);

  return <header className="navbar"><div className="nav-shell">
    <div className="nav-inner">
      <Link className="brand" href="/" aria-label="تغميسة — الرئيسية"><Image src="/taghmesa-logo.png" alt="" width={46} height={46} priority/><span className="brand-copy"><b>تغميسة</b><small>نكهات أصيلة</small></span></Link>
      <div className="nav-actions">
        <Link className="account-button" href={session ? "/account" : "/login"}><StoreIcon name="user"/><span>{session ? session.user.name.split(" ")[0] : "دخول"}</span></Link>
        <button className="theme-button" onClick={toggleTheme} aria-label="تبديل المظهر" aria-pressed={darkTheme}><StoreIcon name={darkTheme ? "sun" : "moon"}/></button>
        <button className="cart-button" onClick={openDrawer} aria-label={count > 0 ? `السلة، ${count} منتجات` : "السلة"}><StoreIcon name="cart"/><span className="cart-label">السلة</span>{count > 0 && <span className="cart-count">{count}</span>}</button>
      </div>
      <Link className="mobile-user-avatar" href={session ? "/account" : "/login"} aria-label={session ? "حسابي" : "تسجيل الدخول"}><StoreIcon name="user" size={21}/></Link>
    </div>
    <nav className="desktop-nav" aria-label="التنقل الرئيسي">{links.map(([href, label]) => {
      const active = isActive(href);
      return <Link key={href} href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{label}</Link>;
    })}</nav>
  </div></header>;
}
