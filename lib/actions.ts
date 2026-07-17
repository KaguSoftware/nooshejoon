"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { Locale } from "./i18n";

type Json = Partial<Record<Locale, string>>;

async function db() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");
  return supabase;
}

function refresh() {
  // Revalidate every locale of the public menu + admin views.
  revalidatePath("/", "layout");
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(title: Json) {
  const supabase = await db();
  const { data: max } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (max?.sort_order ?? 0) + 1;
  const { error } = await supabase
    .from("categories")
    .insert({ title, sort_order });
  if (error) throw new Error(error.message);
  refresh();
}

export async function updateCategory(id: string, title: Json) {
  const supabase = await db();
  const { error } = await supabase
    .from("categories")
    .update({ title })
    .eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function toggleCategoryActive(id: string, is_active: boolean) {
  const supabase = await db();
  const { error } = await supabase
    .from("categories")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteCategory(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await db();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("categories").update({ sort_order: i + 1 }).eq("id", id),
    ),
  );
  refresh();
}

// ── Items ────────────────────────────────────────────────────────────────────

export type ItemInput = {
  name: Json;
  subtitle: string | null;
  ingredients: Json | null;
  image_url: string | null;
};

export async function createItem(categoryId: string, input: ItemInput) {
  const supabase = await db();
  const { data: max } = await supabase
    .from("items")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (max?.sort_order ?? 0) + 1;
  const { data, error } = await supabase
    .from("items")
    .insert({ category_id: categoryId, ...input, sort_order })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  refresh();
  return data.id as string;
}

export async function updateItem(id: string, input: ItemInput) {
  const supabase = await db();
  const { error } = await supabase.from("items").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function toggleItemActive(id: string, is_active: boolean) {
  const supabase = await db();
  const { error } = await supabase
    .from("items")
    .update({ is_active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteItem(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function reorderItems(orderedIds: string[]) {
  const supabase = await db();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("items").update({ sort_order: i + 1 }).eq("id", id),
    ),
  );
  refresh();
}

// ── Price variants ───────────────────────────────────────────────────────────

export type PriceInput = { label: Json; price: number };

/** Replace all price rows for an item in one shot (simplest for the editor). */
export async function setItemPrices(itemId: string, prices: PriceInput[]) {
  const supabase = await db();
  const { error: delErr } = await supabase
    .from("item_prices")
    .delete()
    .eq("item_id", itemId);
  if (delErr) throw new Error(delErr.message);

  if (prices.length) {
    const rows = prices.map((p, i) => ({
      item_id: itemId,
      label: p.label,
      price: p.price,
      sort_order: i + 1,
    }));
    const { error } = await supabase.from("item_prices").insert(rows);
    if (error) throw new Error(error.message);
  }
  refresh();
}
