import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { getAuth } from "./index";

export async function getCurrentSession() {
  if (!process.env.DATABASE_URL) return null;
  return getAuth().api.getSession({ headers: await headers() });
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
