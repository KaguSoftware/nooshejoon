"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import type { Locale } from "@/lib/i18n";
import type { ItemWithPrices } from "@/lib/types";
import { updateItem, setItemPrices } from "@/lib/actions";
import { Button, LocaleField } from "./ui";

type Json = Partial<Record<Locale, string>>;
type PriceRow = { key: string; label: Json; price: string };

let keySeq = 0;
const nextKey = () => `p${keySeq++}`;

export function ItemEditor({ item }: { item: ItemWithPrices }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<Json>((item.name as Json) ?? {});
  const [subtitle, setSubtitle] = useState(item.subtitle ?? "");
  const [ingredients, setIngredients] = useState<Json>(
    (item.ingredients as Json) ?? {},
  );
  const [imageUrl, setImageUrl] = useState<string | null>(item.image_url);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [prices, setPrices] = useState<PriceRow[]>(
    item.item_prices.length
      ? item.item_prices.map((p) => ({
          key: nextKey(),
          label: (p.label as Json) ?? {},
          price: String(p.price),
        }))
      : [{ key: nextKey(), label: {}, price: "" }],
  );

  async function onUpload(file: File) {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${item.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("item-images")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage
        .from("item-images")
        .getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } else {
      alert("خطا در بارگذاری تصویر: " + error.message);
    }
    setUploading(false);
  }

  function save() {
    start(async () => {
      await updateItem(item.id, {
        name,
        subtitle: subtitle.trim() || null,
        ingredients: Object.values(ingredients).some((v) => v?.trim())
          ? ingredients
          : null,
        image_url: imageUrl,
      });
      await setItemPrices(
        item.id,
        prices
          .filter((p) => p.price.trim() !== "")
          .map((p) => ({ label: p.label, price: Number(p.price) })),
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Content fields */}
      <section className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-frame/60">
        <LocaleField
          label="نام آیتم"
          value={name}
          onChange={setName}
          placeholder="مثلاً: بورک مرغ"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/80">
            زیرعنوان لاتین (مشترک بین زبان‌ها)
          </label>
          <input
            className="field"
            dir="ltr"
            placeholder="Royal Roll"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <LocaleField
          label="مواد تشکیل‌دهنده"
          value={ingredients}
          onChange={setIngredients}
          textarea
          placeholder="سینه مرغ/پنیرکاشار/ادویه مخصوص"
        />
      </section>

      {/* Image */}
      <section className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-frame/60">
        <label className="block text-sm font-medium text-ink/80">
          تصویر آیتم (اختیاری)
        </label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper-bottom ring-1 ring-frame/60">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            <Button
              variant="ghost"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "در حال بارگذاری…" : "انتخاب تصویر"}
            </Button>
            {imageUrl && (
              <Button variant="ghost" onClick={() => setImageUrl(null)}>
                حذف تصویر
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Price variants */}
      <section className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-frame/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink/80">
            گزینه‌های قیمت
          </label>
          <Button
            variant="ghost"
            onClick={() =>
              setPrices((p) => [...p, { key: nextKey(), label: {}, price: "" }])
            }
          >
            + گزینه
          </Button>
        </div>

        {prices.map((row, i) => (
          <div
            key={row.key}
            className="space-y-2 rounded-xl bg-paper-top/60 p-3 ring-1 ring-frame/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">گزینه {i + 1}</span>
              <button
                type="button"
                onClick={() =>
                  setPrices((p) => p.filter((r) => r.key !== row.key))
                }
                className="text-xs text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
            <LocaleField
              label="برچسب"
              value={row.label}
              onChange={(v) =>
                setPrices((p) =>
                  p.map((r) => (r.key === row.key ? { ...r, label: v } : r)),
                )
              }
              placeholder="ظرف ۵۰۰ گرمی"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">
                قیمت (لیر)
              </label>
              <input
                className="field"
                dir="ltr"
                inputMode="numeric"
                placeholder="600"
                value={row.price}
                onChange={(e) =>
                  setPrices((p) =>
                    p.map((r) =>
                      r.key === row.key
                        ? { ...r, price: e.target.value.replace(/[^\d.]/g, "") }
                        : r,
                    ),
                  )
                }
              />
            </div>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3">
        <Button type="button" disabled={pending} onClick={save}>
          {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
        </Button>
        {saved && <span className="text-sm text-olive">ذخیره شد ✓</span>}
      </div>
    </div>
  );
}
