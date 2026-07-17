import Link from "next/link";

export function UnauthorizedView() {
  return <main className="admin-unauthorized">
    <div className="unauthorized-art" aria-hidden="true"><span>401</span><svg viewBox="0 0 360 190"><path d="M24 145c57-46 108 10 165-15 52-22 92 18 149-20"/><circle cx="24" cy="145" r="4"/><circle cx="338" cy="110" r="4"/><path d="M125 101V75a55 55 0 0 1 110 0v26"/><rect x="105" y="98" width="150" height="82" rx="25"/><circle cx="180" cy="135" r="12"/><path d="M180 147v16"/></svg></div>
    <section><small>صلاحية غير متاحة</small><h1>هذه المساحة للمشرفين فقط</h1><p>حسابك لا يملك دور الإدارة المطلوب للوصول إلى لوحة التحكم. يمكنك العودة للمتجر أو تسجيل الدخول بحساب مشرف.</p><div><Link className="primary-button" href="/admin/login">تسجيل دخول المشرف</Link><Link className="outline-button" href="/">العودة للمتجر</Link></div></section>
  </main>;
}
