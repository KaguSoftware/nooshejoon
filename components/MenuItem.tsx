import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/fmt";
import type { ItemWithPrices } from "@/lib/types";

export function MenuItem({
  item,
  locale,
}: {
  item: ItemWithPrices;
  locale: Locale;
}) {
  const name = pick(item.name, locale);
  const ingredients = pick(item.ingredients, locale);
  const prices = [...item.item_prices].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <article className="space-y-3">
      {/* Centered white title pill — a copy of the export design. */}
      <div className="rounded-2xl bg-card px-4 py-3 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] ring-1 ring-frame/40">
        <h3 className="flex flex-wrap items-baseline justify-center gap-x-2 font-bold text-olive-deep leading-tight">
          <span>{name}</span>
          {item.subtitle && (
            <span className="font-semibold text-olive/85 text-[0.95em]">
              {item.subtitle}
            </span>
          )}
        </h3>
        {ingredients && (
          <p className="mt-1 text-sm text-olive/80 leading-snug">
            {ingredients}
          </p>
        )}
      </div>

      {item.image_url && (
        <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-frame/50">
          <Image
            src={item.image_url}
            alt={name}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      )}

      {/* Price variant rows on the paper background. */}
      {prices.length > 0 && (
        <ul className="px-1">
          {prices.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="text-ink/80">{pick(p.label, locale)}</span>
              <span className="font-bold text-olive-deep tabular-nums whitespace-nowrap">
                {formatPrice(p.price, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
