import { requireAdminPage } from "@/lib/auth/server";
import { AdminShell } from "@/domains/admin/components/admin-shell";
import { PasswordForm } from "@/domains/admin/components/password-form";

export const dynamic = "force-dynamic";
export default async function ChangePasswordPage() { const admin = await requireAdminPage(); return <AdminShell username={admin.name}><PasswordForm/></AdminShell>; }
