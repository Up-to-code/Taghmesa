"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreIcon } from "@/components/shared/store-icon";

const tabs = [
  { href: "/account/orders", label: "طلباتي الحالية", description: "تابع حالة طلبك", icon: "cart" },
  { href: "/account/history", label: "سجل الطلبات", description: "طلباتك السابقة", icon: "clock" },
  { href: "/account/profile", label: "بياناتي", description: "العنوان والتواصل", icon: "user" },
] as const;

export function AccountTabs() {
  const pathname = usePathname();
  return <nav className="account-tabs" aria-label="أقسام الحساب">{tabs.map((tab) => {
    const active = pathname === tab.href;
    return <Link key={tab.href} href={tab.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><span><StoreIcon name={tab.icon} size={19}/></span><div><strong>{tab.label}</strong><small>{tab.description}</small></div></Link>;
  })}</nav>;
}
