import { UnauthorizedView } from "@/domains/admin/components/unauthorized-view";

export const metadata = { title: "401 — صلاحية غير متاحة" };
export default function UnauthorizedResponsePage() { return <UnauthorizedView/>; }
