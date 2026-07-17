import "./globals.css";

// Pass-through root. Each route group ([locale] for the public menu, admin for
// the owner panel) renders its own <html>/<body> so it can set the correct
// lang/dir and font. This is supported in the App Router.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
