"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminRequest } from "../../api";

export function CustomerStatusControl({ customerId, initiallyBanned }: { customerId: string; initiallyBanned: boolean }) {
  const [banned, setBanned] = useState(initiallyBanned);
  const [saving, setSaving] = useState(false);

  async function update(value: string) {
    const nextBanned = value === "banned";
    setSaving(true);
    try {
      await adminRequest(`/customers/${encodeURIComponent(customerId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ banned: nextBanned, reason: nextBanned ? "أوقفه مدير المتجر" : "" }),
      });
      setBanned(nextBanned);
      toast.success(nextBanned ? "تم إيقاف حساب العميل" : "تم تفعيل حساب العميل");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذّر تحديث حالة العميل");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-w-52 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3">
      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><ShieldCheck className="size-4" />حالة حساب العميل</span>
      <Select value={banned ? "banned" : "active"} disabled={saving} onValueChange={(value) => void update(value)}>
        <SelectTrigger className="shadow-none"><SelectValue /></SelectTrigger>
        <SelectContent dir="rtl"><SelectItem value="active"><Badge className="bg-emerald-600">حساب نشط</Badge></SelectItem><SelectItem value="banned"><Badge variant="destructive">حساب موقوف</Badge></SelectItem></SelectContent>
      </Select>
    </div>
  );
}
