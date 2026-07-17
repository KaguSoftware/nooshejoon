import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

// The proxy already redirects "/" → "/tr", but keep this as a safety net for
// any direct render of the root route.
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
