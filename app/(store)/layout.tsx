import { StoreShell } from "@/components/shared/store-shell";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
