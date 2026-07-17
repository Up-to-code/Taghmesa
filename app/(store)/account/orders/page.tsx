import { AccountOrdersPanel } from "@/domains/account/components/account-dashboard";
import { getAccountDashboard } from "@/domains/account/repository";
import { requireCustomerPage } from "@/lib/auth/server";

export default async function CurrentOrdersPage() {
  const user = await requireCustomerPage();
  const { orders } = await getAccountDashboard(user.id);
  return <AccountOrdersPanel orders={orders}/>;
}
