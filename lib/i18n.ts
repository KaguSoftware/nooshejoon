// Tiny i18n core — no external lib. Locales, direction, and content-field
// resolution with a fallback chain so a missing translation never shows blank.

export const LOCALES = ["tr", "fa", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: "Türkçe",
  fa: "فارسی",
  en: "English",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

/**
 * A translatable content field stored as jsonb, e.g. {"tr":"..","fa":"..","en":".."}.
 * Some rows may be partially filled, hence the fallback.
 */
export type I18nField = Partial<Record<Locale, string>> | null | undefined;

/** Resolve a translatable field for a locale: locale → fa → tr → first non-empty → "". */
export function pick(field: I18nField, locale: Locale): string {
  if (!field) return "";
  const chain: Locale[] = [locale, "fa", "tr"];
  for (const l of chain) {
    const v = field[l];
    if (v && v.trim()) return v;
  }
  for (const l of LOCALES) {
    const v = field[l];
    if (v && v.trim()) return v;
  }
  return "";
}
