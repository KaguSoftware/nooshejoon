import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Category, ItemWithPrices, CategoryWithItems } from "./types";

// Admin queries: authenticated, so RLS returns inactive rows too.

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getCategoryWithItems(
  id: string,
): Promise<CategoryWithItems | null> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("categories")
    .select(
      `id, title, sort_order, is_active, created_at,
       items (
         id, category_id, name, subtitle, ingredients, image_url,
         sort_order, is_active, created_at,
         item_prices ( id, item_id, label, price, sort_order )
       )`,
    )
    .eq("id", id)
    .order("sort_order", { referencedTable: "items", ascending: true })
    .order("sort_order", {
      referencedTable: "items.item_prices",
      ascending: true,
    })
    .single();
  if (error) return null;
  return data as unknown as CategoryWithItems;
}

export async function getItem(id: string): Promise<ItemWithPrices | null> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("items")
    .select(
      `id, category_id, name, subtitle, ingredients, image_url,
       sort_order, is_active, created_at,
       item_prices ( id, item_id, label, price, sort_order )`,
    )
    .eq("id", id)
    .order("sort_order", {
      referencedTable: "item_prices",
      ascending: true,
    })
    .single();
  if (error) return null;
  return data as unknown as ItemWithPrices;
}
