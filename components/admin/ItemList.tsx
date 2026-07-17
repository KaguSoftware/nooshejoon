"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pick, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/fmt";
import type { ItemWithPrices } from "@/lib/types";
import {
  createItem,
  deleteItem,
  toggleItemActive,
  reorderItems,
} from "@/lib/actions";
import { SortableList, DragHandle } from "./SortableList";
import { Button, Toggle } from "./ui";

const ADMIN_LOCALE: Locale = "fa";

export function ItemList({
  categoryId,
  items,
}: {
  categoryId: string;
  items: ItemWithPrices[];
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function addAndEdit() {
    start(async () => {
      const id = await createItem(categoryId, {
        name: { fa: "آیتم جدید" },
        subtitle: null,
        ingredients: null,
        image_url: null,
      });
      router.push(`/admin/items/${id}`);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">آیتم‌ها</h2>
        <Button disabled={pending} onClick={addAndEdit}>
          + آیتم جدید
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">هنوز آیتمی نیست.</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(ids) => start(() => reorderItems(ids))}
        >
          {(item) => (
            <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-frame/60">
              <DragHandle />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/items/${item.id}`}
                  className="font-semibold text-olive-deep hover:underline"
                >
                  {pick(item.name, ADMIN_LOCALE) || "بدون نام"}
                </Link>
                {item.subtitle && (
                  <span className="ms-2 text-sm text-olive/70">
                    {item.subtitle}
                  </span>
                )}
                <div className="mt-0.5 text-xs text-muted">
                  {item.item_prices
                    .map((p) => formatPrice(p.price, ADMIN_LOCALE))
                    .join(" · ") || "بدون قیمت"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={item.is_active}
                  onChange={(v) => start(() => toggleItemActive(item.id, v))}
                />
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/admin/items/${item.id}`)}
                >
                  ویرایش
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm("این آیتم حذف شود؟"))
                      start(() => deleteItem(item.id));
                  }}
                >
                  حذف
                </Button>
              </div>
            </div>
          )}
        </SortableList>
      )}
    </div>
  );
}
