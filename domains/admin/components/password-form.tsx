"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function PasswordForm() {
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError(""); const form = new FormData(event.currentTarget); const next = String(form.get("newPassword"));
    if (next !== form.get("confirmPassword")) { setError("كلمة المرور الجديدة غير متطابقة"); return; }
    const { error: changeError } = await authClient.changePassword({ currentPassword: String(form.get("currentPassword")), newPassword: next, revokeOtherSessions: true });
    if (changeError) { setError("كلمة المرور الحالية غير صحيحة أو تعذّر حفظ الجديدة"); return; }
    setMessage("تم تغيير كلمة المرور بنجاح"); event.currentTarget.reset();
  }
  return <form className="admin-card admin-form narrow" onSubmit={submit}><h2>تغيير كلمة المرور</h2>{message && <div className="admin-success">{message}</div>}{error && <div className="admin-error">{error}</div>}<label>كلمة المرور الحالية<input required type="password" name="currentPassword"/></label><label>كلمة المرور الجديدة<input required minLength={8} type="password" name="newPassword"/></label><label>تأكيد كلمة المرور<input required minLength={8} type="password" name="confirmPassword"/></label><button className="primary-button" type="submit">حفظ</button></form>;
}
