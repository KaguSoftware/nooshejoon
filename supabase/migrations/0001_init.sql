-- نوش‌جان menu schema. Translatable content stored as jsonb {"tr","fa","en"}.
-- Run in the Supabase SQL editor (or via the CLI).

create extension if not exists "pgcrypto";

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  title      jsonb not null default '{}'::jsonb,   -- {"tr":..,"fa":..,"en":..}
  sort_order int  not null default 0,
  is_active  bool not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name        jsonb not null default '{}'::jsonb,
  subtitle    text,                                -- shared, e.g. "Royal Roll"
  ingredients jsonb,                               -- {"tr","fa","en"}
  image_url   text,                                -- optional photo (Supabase Storage public URL)
  sort_order  int  not null default 0,
  is_active   bool not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.item_prices (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references public.items(id) on delete cascade,
  label      jsonb not null default '{}'::jsonb,   -- {"tr","fa","en"}
  price      numeric not null,
  sort_order int not null default 0
);

create index if not exists items_category_id_idx  on public.items(category_id);
create index if not exists item_prices_item_id_idx on public.item_prices(item_id);
create index if not exists categories_sort_idx     on public.categories(sort_order);
create index if not exists items_sort_idx          on public.items(sort_order);
create index if not exists item_prices_sort_idx    on public.item_prices(sort_order);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Public may read active rows; only authenticated users may write.

alter table public.categories  enable row level security;
alter table public.items       enable row level security;
alter table public.item_prices enable row level security;

-- Public read (active only)
create policy "categories public read"
  on public.categories for select
  using (is_active = true);

create policy "items public read"
  on public.items for select
  using (is_active = true);

create policy "item_prices public read"
  on public.item_prices for select
  using (true);

-- Authenticated full read (admin sees inactive too)
create policy "categories auth read"
  on public.categories for select to authenticated using (true);
create policy "items auth read"
  on public.items for select to authenticated using (true);
create policy "item_prices auth read"
  on public.item_prices for select to authenticated using (true);

-- Authenticated writes
create policy "categories auth write"
  on public.categories for all to authenticated using (true) with check (true);
create policy "items auth write"
  on public.items for all to authenticated using (true) with check (true);
create policy "item_prices auth write"
  on public.item_prices for all to authenticated using (true) with check (true);

-- ── Storage: item images ────────────────────────────────────────────────────
-- Public bucket 'item-images'. Anyone can read; authenticated users can write.

insert into storage.buckets (id, name, public)
  values ('item-images', 'item-images', true)
  on conflict (id) do nothing;

create policy "item-images public read"
  on storage.objects for select
  using (bucket_id = 'item-images');

create policy "item-images auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'item-images');

create policy "item-images auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'item-images');

create policy "item-images auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'item-images');
