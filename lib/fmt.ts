import type { Locale } from "./i18n";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert Latin digits in a string to Persian digits. */
export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Locale-aware digits: Persian digits for fa, Latin otherwise. */
export function digits(input: string | number, locale: Locale): string {
  return locale === "fa" ? toFa(input) : String(input);
}

const CURRENCY = "₺"; // Turkish Lira mark, shown in every locale.

/**
 * Format a price with the ₺ mark, digits per locale.
 * fa:  «۶۰۰ ₺»   tr/en: «600 ₺»
 */
export function formatPrice(price: number, locale: Locale): string {
  // Trim trailing .0 but keep meaningful decimals.
  const n = Number.isInteger(price) ? String(price) : String(price);
  return `${digits(n, locale)} ${CURRENCY}`;
}
