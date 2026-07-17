import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

// Paths that are NOT locale-prefixed and must be left alone.
const NON_LOCALE_PREFIXES = ["/admin", "/auth", "/api", "/_next"];

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

function isNonLocalePath(pathname: string): boolean {
  return NON_LOCALE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect bare/unprefixed public paths to the default locale.
  if (!isNonLocalePath(pathname) && !hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Otherwise refresh the Supabase session.
  return updateSession(request);
}

export const config = {
  // Skip static assets & files with an extension (e.g. logo.png, favicon.ico).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
