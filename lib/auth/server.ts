import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { auth } from "./index";

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAdminPage() {
  const current = await getCurrentSession();
  if (!current || current.user.role !== "admin") unauthorized();
  return current.user;
}

export async function requireCustomerPage() {
  const current = await getCurrentSession();
  if (!current) redirect("/login?next=/account");
  return current.user;
}
