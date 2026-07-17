import "../globals.css";
import { fontVars } from "../fonts";

// Admin is owner-facing and single-language (Persian, RTL). It edits all three
// locales of the menu content. Auth guarding happens per-page/section, not here,
// because the login page itself lives under /admin.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${fontVars} h-full`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
