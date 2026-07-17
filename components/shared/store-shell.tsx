"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/domains/cart/cart-context";
import { CartDrawer } from "@/domains/cart/components/cart-drawer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { StoreFooter } from "./store-footer";
import { StoreHeader } from "./store-header";
import { StorePromise } from "./store-promise";

function ShellContent({ children }: { children: ReactNode }) {
  const { toast } = useCart();
  const pathname = usePathname();
  const immersiveSearch = pathname === "/search";
  return <>{!immersiveSearch && <StoreHeader/>}<main>{children}</main><StorePromise/><StoreFooter/><MobileBottomNav/><CartDrawer/>{toast && <div className="toast" role="status">● {toast}</div>}</>;
}

export function StoreShell({ children }: { children: ReactNode }) {
  return <CartProvider><ShellContent>{children}</ShellContent></CartProvider>;
}
