"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { StoreIcon } from "@/components/shared/store-icon";
import { authClient } from "@/lib/auth/client";

type CredentialsFormProps = { mode: "sign-in" | "sign-up"; nextPath?: string };

export function CredentialsForm({ mode, nextPath = "/" }: CredentialsFormProps) {
  const isSignUp = mode === "sign-up";
  const nextQuery = nextPath === "/" ? "" : `?next=${encodeURIComponent(nextPath)}`;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email"));
      const password = String(form.get("password"));
      const result = isSignUp
        ? await authClient.signUp.email({ name: String(form.get("name")), email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(isSignUp ? "تعذّر إنشاء الحساب. تأكد من البيانات أو جرّب بريداً آخر." : "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        setBusy(false);
        return;
      }
      window.location.href = nextPath;
    } catch {
      setError("تعذّر الاتصال الآن. حاول مرة أخرى بعد قليل.");
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} aria-busy={busy}>
      <div className="auth-form-kicker">{isSignUp ? "أهلاً بك في تغميسة" : "مرحباً بعودتك"}</div>
      <h1>{isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}</h1>
      <p className="auth-form-intro">{isSignUp ? "أنشئ حسابك واحفظ تفاصيلك لطلب أسرع." : "أدخل بياناتك للعودة إلى طلباتك ونكهاتك المفضلة."}</p>
      {error && <div className="admin-error" role="alert">{error}</div>}
      {isSignUp && <label className="auth-field"><span>الاسم</span><span className="auth-input"><StoreIcon name="user"/><input name="name" required autoFocus autoComplete="name" maxLength={100} placeholder="اسمك الكامل"/></span></label>}
      <label className="auth-field"><span>البريد الإلكتروني</span><span className="auth-input"><StoreIcon name="mail"/><input name="email" type="email" required autoFocus={!isSignUp} autoComplete="email" dir="ltr" placeholder="name@example.com"/></span></label>
      <label className="auth-field"><span>كلمة المرور</span><span className="auth-input"><StoreIcon name="lock"/><input name="password" type="password" required minLength={8} maxLength={128} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="ثمانية أحرف على الأقل"/></span></label>
      <button className="auth-submit" disabled={busy}>{busy && <span className="auth-button-spinner" aria-hidden="true"/>}<span>{busy ? "لحظة واحدة..." : isSignUp ? "إنشاء الحساب" : "دخول"}</span>{!busy && <StoreIcon name="arrow-left"/>}</button>
      <p className="auth-switch">{isSignUp ? <>لديك حساب؟ <Link href={`/login${nextQuery}`}>سجّل الدخول</Link></> : <>ليس لديك حساب؟ <Link href={`/register${nextQuery}`}>أنشئ حساباً</Link></>}</p>
    </form>
  );
}
