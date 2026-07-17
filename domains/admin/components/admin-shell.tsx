"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ExternalLink,
  FolderTree,
  LogOut,
  Package,
  ReceiptText,
  Settings,
  Store,
  TicketPercent,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/logger";

const navigation = [
  {
    href: "/admin",
    label: "نظرة عامة",
    description: "المبيعات والأداء",
    icon: BarChart3,
    exact: true,
  },
  {
    href: "/admin/categories",
    label: "الفئات",
    description: "هيكل وتنظيم المتجر",
    icon: FolderTree,
  },
  {
    href: "/admin/products",
    label: "المنتجات",
    description: "الكتالوج والأسعار",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    description: "المتابعة والتنفيذ",
    icon: ReceiptText,
  },
  {
    href: "/admin/customers",
    label: "العملاء",
    description: "الحسابات وسجل الطلبات",
    icon: UsersRound,
  },
  {
    href: "/admin/coupons",
    label: "رموز الخصم",
    description: "العروض والاستخدام",
    icon: TicketPercent,
  },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  async function logout() {
    try {
      await authClient.signOut();
      window.location.href = "/admin/login";
    } catch (error) {
      logger.error("admin.logout_failed", { error: String(error) });
      toast.error("تعذّر تسجيل الخروج");
    }
  }
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
            "--sidebar-width-icon": "4.5rem",
          } as React.CSSProperties
        }
        className="admin-v2 bg-[#f5f8f9] text-slate-950"
      >
        <Sidebar
          side="right"
          collapsible="icon"
          className="border-l-0 bg-[#073f47] text-white"
          dir="rtl"
        >
          <SidebarHeader className="px-4 py-5">
            <Link
              href="/admin"
              className="flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/7 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            >
              <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                <Image
                  src="/taghmesa-logo.png"
                  width={42}
                  height={42}
                  alt="تغميسة"
                />
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <strong className="block text-lg font-black">تغميسة</strong>
                <small className="block text-[10px] text-cyan-100/60">
                  مركز إدارة المتجر
                </small>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-[10px] font-bold text-cyan-100/45 group-data-[collapsible=icon]:hidden">
                مساحة العمل
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 px-2">
                  {navigation.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className="h-14 rounded-xl text-white/65 hover:bg-white/10 hover:text-white data-active:bg-cyan-400/15 data-active:text-white group-data-[collapsible=icon]:justify-center"
                        >
                          <Link href={item.href}>
                            <item.icon className="size-5 shrink-0" />
                            <span className="min-w-0">
                              <b className="block text-sm">{item.label}</b>
                              <small className="block truncate text-[9px] font-normal text-white/40">
                                {item.description}
                              </small>
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="عرض المتجر"
                  className="h-11 rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/" target="_blank">
                    <Store />
                    <span>عرض المتجر</span>
                    <ExternalLink className="mr-auto size-3" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="تسجيل الخروج"
                  onClick={logout}
                  className="h-11 rounded-xl text-rose-200/75 hover:bg-rose-400/10 hover:text-rose-100"
                >
                  <LogOut />
                  <span>تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-w-0 bg-[#f5f8f9]">
          <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl md:px-8">
            <SidebarTrigger className="size-10 rounded-xl border border-slate-200 text-slate-600" />
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
              كل الأنظمة تعمل
            </div>
            <div className="mr-auto">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-11 gap-3 rounded-xl px-2"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-cyan-50 font-black text-cyan-700">
                      {username.slice(0, 1)}
                    </span>
                    <span className="hidden text-right sm:block">
                      <b className="block max-w-36 truncate text-xs">
                        {username}
                      </b>
                      <small className="block text-[9px] text-slate-400">
                        مدير المتجر
                      </small>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>حساب المشرف</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/change-password">
                      <Settings />
                      تغيير كلمة المرور
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" target="_blank">
                      <Boxes />
                      فتح المتجر
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="mx-auto w-full max-w-[1500px] flex-1 p-4 sm:p-6 lg:p-9">
            {children}
          </div>
        </SidebarInset>
        <Toaster position="top-center" richColors dir="rtl" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
