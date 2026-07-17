"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { pick, type Locale } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import {
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
  reorderCategories,
} from "@/lib/actions";
import { SortableList, DragHandle } from "./SortableList";
import { Button, LocaleField, Toggle } from "./ui";

const ADMIN_LOCALE: Locale = "fa";

export function CategoryList({ categories }: { categories: Category[] }) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">دسته‌بندی‌ها</h2>
        <Button onClick={() => setAdding((v) => !v)}>
          {adding ? "بستن" : "+ دسته جدید"}
        </Button>
      </div>

      {adding && (
        <div className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-frame/60">
          <LocaleField
            label="عنوان دسته"
            value={newTitle}
            onChange={setNewTitle}
            placeholder="مثلاً: بورک و دلمه"
          />
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                await createCategory(newTitle);
                setNewTitle({});
                setAdding(false);
              })
            }
          >
            افزودن
          </Button>
        </div>
      )}

      <SortableList
        items={categories}
        onReorder={(ids) => start(() => reorderCategories(ids))}
      >
        {(cat) => (
          <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-frame/60">
            <DragHandle />
            <div className="min-w-0 flex-1">
              {editing === cat.id ? (
                <div className="space-y-2">
                  <LocaleField
                    label="عنوان"
                    value={editTitle}
                    onChange={setEditTitle}
                  />
                  <div className="flex gap-2">
                    <Button
                      disabled={pending}
                      onClick={() =>
                        start(async () => {
                          await updateCategory(cat.id, editTitle);
                          setEditing(null);
                        })
                      }
                    >
                      ذخیره
                    </Button>
                    <Button variant="ghost" onClick={() => setEditing(null)}>
                      انصراف
                    </Button>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/admin/categories/${cat.id}`}
                  className="group inline-flex items-center gap-1.5 font-semibold text-olive-deep hover:underline"
                >
                  {pick(cat.title, ADMIN_LOCALE) || "بدون عنوان"}
                  <span className="text-xs text-muted transition-transform group-hover:-translate-x-0.5">
                    ↩
                  </span>
                </Link>
              )}
            </div>

            {editing !== cat.id && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/${cat.id}`}
                  className="rounded-xl bg-olive/10 px-3 py-2 text-sm font-semibold text-olive-deep transition-colors hover:bg-olive/20"
                >
                  آیتم‌ها ←
                </Link>
                <Toggle
                  checked={cat.is_active}
                  onChange={(v) =>
                    start(() => toggleCategoryActive(cat.id, v))
                  }
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(cat.id);
                    setEditTitle((cat.title as Record<string, string>) ?? {});
                  }}
                >
                  ویرایش
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm("این دسته و همه آیتم‌هایش حذف شوند؟"))
                      start(() => deleteCategory(cat.id));
                  }}
                >
                  حذف
                </Button>
              </div>
            )}
          </div>
        )}
      </SortableList>
    </div>
  );
}
