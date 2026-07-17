import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CategoryWithItems } from "./types";

/**
 * Full public menu: active categories → active items → price variants,
 * each ordered by sort_order. RLS already limits to active rows for anon.
 */
export async function getMenu(): Promise<CategoryWithItems[]> {
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
    .eq("is_active", true)
    .eq("items.is_active", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "items", ascending: true })
    .order("sort_order", {
      referencedTable: "items.item_prices",
      ascending: true,
    });

  if (error) {
    console.error("getMenu error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as CategoryWithItems[];
}
