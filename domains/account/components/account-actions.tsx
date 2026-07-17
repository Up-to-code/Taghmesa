"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { StoreIcon } from "@/components/shared/store-icon";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/logger";
import type { CustomerProfile } from "../repository";

type ProfileDefaults = Pick<CustomerProfile, "firstName" | "lastName" | "phone" | "city" | "address">;

export function ProfileForm({ profile }: { profile: ProfileDefaults }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setMessage("");
    setError("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          phone: form.get("phone"),
          city: form.get("city"),
          address: form.get("address"),
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "تعذّر حفظ بياناتك");
      setMessage("تم حفظ بياناتك بنجاح");
      router.refresh();
    } catch (caught) {
      logger.error("account.profile_update_failed", { error: String(caught) });
      setError(caught instanceof Error ? caught.message : "تعذّر حفظ بياناتك");
    } finally {
      setSaving(false);
    }
  }

  return <form className="account-profile-form" onSubmit={submit}>
    <div className="account-form-row">
      <label><span>الاسم الأول</span><input name="firstName" required maxLength={80} defaultValue={profile.firstName}/></label>
      <label><span>اسم العائلة</span><input name="lastName" required maxLength={80} defaultValue={profile.lastName}/></label>
    </div>
    <div className="account-form-row">
      <label><span>رقم الجوال</span><input name="phone" required minLength={7} maxLength={20} inputMode="tel" dir="ltr" defaultValue={profile.phone}/></label>
      <label><span>المدينة</span><input name="city" required maxLength={80} defaultValue={profile.city}/></label>
    </div>
    <label><span>عنوان التوصيل</span><textarea name="address" required minLength={3} maxLength={1000} rows={3} defaultValue={profile.address}/></label>
    <div className="account-form-actions">
      <button type="submit" disabled={saving}>{saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}<StoreIcon name="check" size={17}/></button>
      {message && <span className="account-form-success" role="status">{message}</span>}
      {error && <span className="account-form-error" role="alert">{error}</span>}
    </div>
  </form>;
}

export function AccountSignOut() {
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (error) {
      logger.error("account.sign_out_failed", { error: String(error) });
      setBusy(false);
    }
  }
  return <button className="account-sign-out" type="button" disabled={busy} onClick={signOut}>{busy ? "لحظة..." : "تسجيل الخروج"}</button>;
}

export function ClaimPreviousOrder({ defaultOrderNumber = "" }: { defaultOrderNumber?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");
    setError("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/account/orders/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderNumber: form.get("orderNumber"), phone: form.get("phone") }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "تعذّر ربط الطلب");
      setMessage("تمت إضافة الطلب إلى حسابك");
      formElement.reset();
      router.refresh();
    } catch (caught) {
      logger.error("account.order_claim_failed", { error: String(caught) });
      setError(caught instanceof Error ? caught.message : "تعذّر ربط الطلب");
    } finally {
      setBusy(false);
    }
  }

  return <form className="account-claim-form" onSubmit={submit}>
    <div><label><span>رقم الطلب السابق</span><input name="orderNumber" required maxLength={24} dir="ltr" placeholder="TG-XXXXXXXX" defaultValue={defaultOrderNumber}/></label><label><span>رقم الجوال المستخدم</span><input name="phone" required minLength={7} maxLength={20} inputMode="tel" dir="ltr" placeholder="05XXXXXXXX"/></label></div>
    <button type="submit" disabled={busy}>{busy ? "جارٍ الربط..." : "إضافة الطلب"}</button>
    {message && <span className="account-form-success" role="status">{message}</span>}
    {error && <span className="account-form-error" role="alert">{error}</span>}
  </form>;
}
