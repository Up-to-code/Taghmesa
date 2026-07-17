import type { Metadata } from "next";
import { AccountShell } from "@/domains/account/components/account-shell";
import { requireCustomerPage } from "@/lib/auth/server";

export const metadata: Metadata = { title: "حسابي — تغميسة" };

export default async function CustomerAccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCustomerPage();
  return <AccountShell user={{ name: user.name, email: user.email }}>{children}</AccountShell>;
}
