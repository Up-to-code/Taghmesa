"use client";

import { KeyRound, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/logger";
import { AdminPageHeader } from "./ui/admin-page-header";

export function PasswordForm(){const[busy,setBusy]=useState(false);async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);const form=new FormData(event.currentTarget);const next=String(form.get("newPassword"));if(next!==form.get("confirmPassword")){toast.error("كلمة المرور الجديدة غير متطابقة");setBusy(false);return}try{const{error}=await authClient.changePassword({currentPassword:String(form.get("currentPassword")),newPassword:next,revokeOtherSessions:true});if(error){toast.error("كلمة المرور الحالية غير صحيحة أو تعذّر الحفظ");return}toast.success("تم تغيير كلمة المرور");event.currentTarget.reset()}catch(error){logger.error("admin.password_change_failed",{error:String(error)});toast.error("تعذّر تغيير كلمة المرور")}finally{setBusy(false)}}return <><AdminPageHeader eyebrow="إعدادات الحساب" title="الأمان وكلمة المرور" description="حدّث كلمة مرور حساب المشرف وأغلق الجلسات الأخرى."/><Card className="max-w-2xl border-slate-200/80"><CardHeader><span className="mb-2 grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><KeyRound/></span><CardTitle>تغيير كلمة المرور</CardTitle><CardDescription>استخدم 8 أحرف على الأقل واختر كلمة يصعب تخمينها.</CardDescription></CardHeader><CardContent><form onSubmit={submit}><FieldGroup><Field><FieldLabel>كلمة المرور الحالية</FieldLabel><Input required type="password" name="currentPassword" autoComplete="current-password"/></Field><Field><FieldLabel>كلمة المرور الجديدة</FieldLabel><Input required minLength={8} type="password" name="newPassword" autoComplete="new-password"/></Field><Field><FieldLabel>تأكيد كلمة المرور</FieldLabel><Input required minLength={8} type="password" name="confirmPassword" autoComplete="new-password"/></Field><Button disabled={busy} className="w-fit bg-cyan-700 text-white hover:bg-cyan-800"><Save/>{busy?"جاري الحفظ…":"حفظ كلمة المرور"}</Button></FieldGroup></form></CardContent></Card></>}
