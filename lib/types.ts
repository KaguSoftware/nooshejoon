import type { I18nField } from "./i18n";

export type Category = {
  id: string;
  title: I18nField;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ItemPrice = {
  id: string;
  item_id: string;
  label: I18nField;
  price: number;
  sort_order: number;
};

export type Item = {
  id: string;
  category_id: string;
  name: I18nField;
  subtitle: string | null;
  ingredients: I18nField;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

// Nested shapes returned by the menu query.
export type ItemWithPrices = Item & { item_prices: ItemPrice[] };
export type CategoryWithItems = Category & { items: ItemWithPrices[] };
