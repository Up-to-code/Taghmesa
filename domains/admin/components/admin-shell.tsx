"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

export function AdminShell({ username, children }: { username: string; children: ReactNode }) {
  const pathname = usePathname();
  async function logout() { await authClient.signOut(); window.location.href = "/admin/login"; }
  return <div className="admin-area"><header className="admin-header"><Link href="/admin/products"><strong>لوحة تحكم تغميسة</strong></Link><nav><span>أهلاً {username}</span><Link href="/admin/change-password">تغيير كلمة المرور</Link><button onClick={logout}>تسجيل الخروج</button></nav></header><div className="admin-wrap"><nav className="admin-tabs"><Link className={pathname === "/admin/products" ? "active" : ""} href="/admin/products">المنتجات</Link><Link className={pathname === "/admin/orders" ? "active" : ""} href="/admin/orders">الطلبات</Link></nav>{children}</div></div>;
}
