"use client";

import Link from "next/link";
import {
  ArrowUpLeft,
  BarChart3,
  CircleDollarSign,
  Eye,
  EyeOff,
  Package,
  Plus,
  ReceiptText,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminOverview as AdminOverviewData } from "../types";
import { AdminPageHeader } from "./ui/admin-page-header";

const statusLabels: Record<string, string> = {
  new: "مستلم",
  preparing: "قيد التحضير",
  out_for_delivery: "قيد التوصيل",
  delivered: "مكتمل",
  cancelled: "ملغي",
};

const colors = ["#2563eb", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];
const metricStyles = [
  { icon: CircleDollarSign, bg: "bg-cyan-50", color: "text-cyan-700" },
  { icon: ReceiptText, bg: "bg-blue-50", color: "text-blue-700" },
  { icon: Package, bg: "bg-violet-50", color: "text-violet-700" },
  { icon: UsersRound, bg: "bg-emerald-50", color: "text-emerald-700" },
];

export function AdminOverview({ overview }: { overview: AdminOverviewData }) {
  const metrics = [
    {
      label: "إجمالي المبيعات",
      value: `${overview.totals.revenue.toLocaleString("ar-SA", { maximumFractionDigits: 0 })} ر.س`,
      note: "للطلبات غير الملغاة",
    },
    {
      label: "الطلبات",
      value: overview.totals.orders.toLocaleString("ar-SA"),
      note: "كل حالات الطلب",
    },
    {
      label: "المنتجات",
      value: overview.totals.products.toLocaleString("ar-SA"),
      note: "داخل الكتالوج",
    },
    {
      label: "العملاء",
      value: overview.totals.customers.toLocaleString("ar-SA"),
      note: "حسابات مسجلة",
    },
  ];
  const catalogStatus = [
    {
      label: "ظاهرة في المتجر",
      value: overview.catalog.active,
      icon: Eye,
      className: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "مخفية مؤقتاً",
      value: overview.catalog.hidden,
      icon: EyeOff,
      className: "bg-rose-50 text-rose-700",
    },
    {
      label: "منتجات مميزة",
      value: overview.catalog.featured,
      icon: Sparkles,
      className: "bg-amber-50 text-amber-700",
    },
    {
      label: "تحمل شارة جديد",
      value: overview.catalog.new,
      icon: Plus,
      className: "bg-blue-50 text-blue-700",
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="صباح مليء بالنكهة"
        title="نظرة عامة على المتجر"
        description="اقرأ الأداء، راقب الطلبات، وانتقل بسرعة إلى ما يحتاج انتباهك."
        action={
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-cyan-700 px-5 text-white hover:bg-cyan-800"
          >
            <Link href="/admin/products">
              <Plus />
              إضافة منتج
            </Link>
          </Button>
        }
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const style = metricStyles[index];
          const Icon = style.icon;
          return (
            <Card key={metric.label} className="border-slate-200/80 shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl ${style.bg} ${style.color}`}
                >
                  <Icon />
                </span>
                <div>
                  <small className="font-bold text-slate-400">{metric.label}</small>
                  <strong className="mt-1 block text-2xl font-black tracking-tight text-slate-950">
                    {metric.value}
                  </strong>
                  <p className="mt-1 text-[9px] text-slate-400">{metric.note}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="mb-5 overflow-hidden border-slate-200/80 py-0 shadow-sm">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[220px_repeat(4,minmax(0,1fr))] lg:items-center">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <small className="font-bold text-cyan-700">تحديث مباشر</small>
              <h2 className="mt-1 font-black text-slate-950">حالة الكتالوج</h2>
              <p className="mt-1 text-[9px] text-slate-400">
                تتحدث بعد كل إنشاء أو تعديل
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-cyan-700">
              <Link href="/admin/products">
                الإدارة
                <ArrowUpLeft />
              </Link>
            </Button>
          </div>
          {catalogStatus.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <span className={`grid size-10 place-items-center rounded-xl ${item.className}`}>
                  <Icon className="size-4" />
                </span>
                <span>
                  <b className="block text-lg font-black text-slate-950">
                    {item.value.toLocaleString("ar-SA")}
                  </b>
                  <small className="block text-[9px] text-slate-400">{item.label}</small>
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <section className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.65fr)]">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2 text-cyan-700">
                <TrendingUp />
                آخر 7 أيام
              </Badge>
              <CardTitle>اتجاه الأداء</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" dir="rtl">
              <TabsList className="mb-4 bg-blue-50">
                <TabsTrigger
                  value="revenue"
                  className="data-active:bg-blue-600 data-active:text-white"
                >
                  المبيعات
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-active:bg-blue-600 data-active:text-white"
                >
                  عدد الطلبات
                </TabsTrigger>
              </TabsList>
              {[
                ["revenue", "المبيعات", "#0891b2", " ر.س"],
                ["orders", "الطلبات", "#2563eb", ""],
              ].map(([value, label, color, suffix]) => (
                <TabsContent value={value} key={value}>
                  <div className="h-72 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={overview.sales}
                        margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id={`fill-${value}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e8eef0" vertical={false} />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#789093", fontSize: 10 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          width={45}
                          tick={{ fill: "#789093", fontSize: 9 }}
                        />
                        <RechartsTooltip
                          formatter={(amount) => [
                            `${Number(amount).toLocaleString("ar-SA")}${suffix}`,
                            label,
                          ]}
                          contentStyle={{
                            borderRadius: 12,
                            borderColor: "#dbe5e7",
                            direction: "rtl",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey={value}
                          stroke={color}
                          strokeWidth={3}
                          fill={`url(#fill-${value})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <Badge variant="secondary" className="mb-2 w-fit text-violet-700">
              <BarChart3 />
              التوزيع الحالي
            </Badge>
            <CardTitle>حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {overview.statuses.length ? (
              <>
                <div className="h-48" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overview.statuses}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={53}
                        outerRadius={78}
                        paddingAngle={4}
                      >
                        {overview.statuses.map((item, index) => (
                          <Cell key={item.name} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {overview.statuses.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <i
                        className="size-2 rounded-full"
                        style={{ background: colors[index % colors.length] }}
                      />
                      <span className="text-slate-500">{item.name}</span>
                      <b className="mr-auto">{item.value.toLocaleString("ar-SA")}</b>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-16 text-center text-sm text-slate-400">لا توجد طلبات بعد.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden border-slate-200/80 py-0 shadow-sm">
        <CardHeader className="flex-row items-center justify-between border-b bg-slate-50/60 p-5">
          <div>
            <small className="font-bold text-cyan-700">أحدث النشاطات</small>
            <CardTitle className="mt-1">آخر الطلبات</CardTitle>
          </div>
          <Button asChild variant="ghost">
            <Link href="/admin/orders">
              عرض الكل
              <ArrowUpLeft />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {overview.recentOrders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-right text-xs">
                <thead className="text-[10px] text-slate-400">
                  <tr>
                    {[
                      "رقم الطلب",
                      "العميل",
                      "التاريخ",
                      "الحالة",
                      "الإجمالي",
                    ].map((item) => (
                      <th key={item} className="px-5 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {overview.recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4 font-black text-cyan-700">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4 font-bold">{order.customer}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="secondary">
                          {statusLabels[order.status] ?? order.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-black">{order.total.toFixed(2)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-12 text-center text-slate-400">لا توجد طلبات بعد.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
