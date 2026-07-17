import { AccountProfilePanel } from "@/domains/account/components/account-dashboard";
import { getCustomerProfile } from "@/domains/account/repository";
import { requireCustomerPage } from "@/lib/auth/server";

export default async function AccountProfilePage() {
  const user = await requireCustomerPage();
  const profile = await getCustomerProfile(user.id);
  return <AccountProfilePanel profile={profile}/>;
}
