"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    // Replace the leading /xx segment with the chosen locale.
    const rest = pathname.replace(/^\/(tr|fa|en)(?=\/|$)/, "") || "";
    router.push(`/${locale}${rest}`);
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm">
      {LOCALES.map((l, i) => {
        const active = l === current;
        return (
          <span key={l} className="inline-flex items-center">
            {i > 0 && <span className="mx-1.5 text-frame">·</span>}
            <button
              onClick={() => switchTo(l)}
              aria-current={active ? "true" : undefined}
              className={[
                "transition-colors",
                active
                  ? "font-semibold text-olive-deep"
                  : "text-muted hover:text-olive-deep",
              ].join(" ")}
            >
              {LOCALE_NAMES[l]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
