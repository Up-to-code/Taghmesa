import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ui-system.css";
import "./card-system.css";
import "./flavor-system.css";
import "./auth-system.css";
import "./checkout-system.css";
import "./account-system.css";

export const metadata: Metadata = {
  title: "تغميسة — نكهات أصيلة",
  description: "تغميسات وصوصات وأطباق بيتية محضّرة بعناية وحب",
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0A9BA2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
