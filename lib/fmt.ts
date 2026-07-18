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
 *
 * The number+symbol group is wrapped in a Left-To-Right Isolate (U+2066…U+2069)
 * so the ₺ mark always renders to the right of the number, even inside an RTL
 * (Persian) container where the visual order would otherwise be flipped.
 */
export function formatPrice(price: number, locale: Locale): string {
  // Trim trailing .0 but keep meaningful decimals.
  const n = Number.isInteger(price) ? String(price) : String(price);
  const LRI = "⁦"; // Left-To-Right Isolate
  const PDI = "⁩"; // Pop Directional Isolate
  return `${LRI}${digits(n, locale)} ${CURRENCY}${PDI}`;
}
