import { CredentialsForm } from "@/domains/auth/components/credentials-form";
import { AuthShell } from "@/components/shared/auth-shell";

export const metadata = { title: "إنشاء حساب — تغميسة" };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const requested = (await searchParams).next;
  const nextPath = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  return <AuthShell><CredentialsForm mode="sign-up" nextPath={nextPath}/></AuthShell>;
}
