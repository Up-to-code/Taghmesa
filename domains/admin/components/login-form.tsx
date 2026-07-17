"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function LoginForm() {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const form = new FormData(event.currentTarget);
    const { error: loginError } = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) });
    if (loginError) { setError("البريد الإلكتروني أو كلمة المرور غير صحيحة"); setBusy(false); return; }
    const { data } = await authClient.getSession();
    if (data?.user.role !== "admin") {
      await authClient.signOut();
      setError("هذا الحساب لا يملك صلاحية الإدارة");
      setBusy(false);
      return;
    }
    window.location.href = "/admin/products";
  }
  return <form className="login-box" onSubmit={submit}><div className="admin-logo">تغميسة</div><h1>لوحة التحكم</h1><p>سجّل دخولك لإدارة المنتجات والطلبات</p>{error && <div className="admin-error" role="alert">{error}</div>}<label>البريد الإلكتروني<input name="email" type="email" required autoFocus autoComplete="email"/></label><label>كلمة المرور<input name="password" type="password" required autoComplete="current-password"/></label><button className="primary-button full" disabled={busy}>{busy ? "جاري الدخول..." : "دخول"}</button></form>;
}
