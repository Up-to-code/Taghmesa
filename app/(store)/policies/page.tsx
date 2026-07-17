import { PoliciesView, policySections } from "@/domains/policies/components/policies-view";

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const requestedSection = (await searchParams).section;
  const activeSection = policySections.some(({ id }) => id === requestedSection)
    ? (requestedSection as (typeof policySections)[number]["id"])
    : "delivery";

  return <PoliciesView activeSection={activeSection} />;
}
