-- ============================================================================
-- نوش‌جان — FULL DATABASE SETUP (schema + RLS + storage + seed)
-- Paste this whole file into the Supabase SQL Editor and run once.
-- ============================================================================

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


-- Seed from the 7 نوش‌جان exports. FA is transcribed verbatim from the images;
-- TR/EN are first-pass translations the owner refines in the admin.
-- Idempotent-ish: only seeds when categories table is empty.

do $$
declare
  cat uuid;
  it  uuid;
begin
  if exists (select 1 from public.categories) then
    raise notice 'categories not empty — skipping seed';
    return;
  end if;

  -- ── 1) بورک و دلمه ────────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Börek ve Dolma","fa":"بورک و دلمه","en":"Börek & Dolma"}', 1)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Tavuk Böreği","fa":"بورک مرغ","en":"Chicken Börek"}',
      'Royal Roll',
      '{"tr":"Tavuk göğsü / kaşar / özel baharat","fa":"سینه مرغ/پنیرکاشار/ادویه مخصوص","en":"Chicken breast / kashar cheese / special spices"}',
      1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 600, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 500, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Ispanaklı Börek","fa":"بورک اسفناج","en":"Spinach Börek"}',
      'Veggie Roll',
      '{"tr":"Ispanak / kaşar / soğan / sarımsak","fa":"اسفناج/پنیر کاشار/ پیاز/ سیر","en":"Spinach / kashar / onion / garlic"}',
      2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 450, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 350, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Patatesli Tavuk Böreği","fa":"بورک سیب‌زمینی و مرغ","en":"Potato & Chicken Börek"}',
      'Creamy Roll',
      '{"tr":"Tavuk göğsü / patates / kaşar / özel baharat","fa":"سینه مرغ/سیب‌زمینی/پنیرکاشار/ادویه مخصوص","en":"Chicken breast / potato / kashar / special spices"}',
      3)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 650, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 560, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Dolma","fa":"دلمه","en":"Dolma"}',
      null, null, 4)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 600, 1);

  -- ── 2) بورک و سمبوسه ──────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Börek ve Samosa","fa":"بورک و سمبوسه","en":"Börek & Samosa"}', 2)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Etli Börek","fa":"بورک گوشت","en":"Meat Börek"}',
      'Premium Roll',
      '{"tr":"Kıyma / kaşar / capia biber / özel baharat","fa":"گوشت چرخ کرده/پنیر کاشار/فلفل کاپی/ادویه مخصوص","en":"Ground meat / kashar / capia pepper / special spices"}',
      1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 600, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 680, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Etli ve Patlıcanlı Börek","fa":"بورک گوشت و بادمجان","en":"Meat & Eggplant Börek"}',
      'Mix Roll',
      '{"tr":"Kıyma / kaşar / közlenmiş patlıcan","fa":"گوشت چرخ کرده/پنیرکاشار/بادمجان کبابی","en":"Ground meat / kashar / grilled eggplant"}',
      2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 680, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 600, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Samosa","fa":"سمبوسه","en":"Samosa"}',
      'Golden Triangle',
      '{"tr":"Lavaş / patates / tavuk / aromatik sebzeler","fa":"نان لواش/سیب‌زمینی/مرغ/سبزیجات معطر","en":"Lavash / potato / chicken / aromatic vegetables"}',
      3)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 400, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 350, 2);

  -- ── 3) ناگت ───────────────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Nugget","fa":"ناگت","en":"Nuggets"}', 3)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Klasik Tavuk Nugget","fa":"ناگت مرغ کلاسیک","en":"Classic Chicken Nugget"}',
      'Chiko Pop', null, 1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 320, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 370, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Tavuk ve Ispanak Nugget","fa":"ناگت مرغ و اسفناج","en":"Chicken & Spinach Nugget"}',
      'Popeye Pop', null, 2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 350, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 420, 2);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat,
      '{"tr":"Tavuk ve Havuç Nugget","fa":"ناگت مرغ و هویج","en":"Chicken & Carrot Nugget"}',
      'Bunny Pop', null, 3)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 350, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 420, 2);

  -- ── 4) سالاد و پیش‌غذا ────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Salata ve Meze","fa":"سالاد و پیش‌غذا","en":"Salad & Appetizer"}', 4)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Rus Salatası","fa":"سالاد الویه","en":"Olivier Salad"}', null, null, 1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 600, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Makarna Salatası","fa":"سالاد ماکارونی","en":"Pasta Salad"}', null, null, 2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 700, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Patlıcanlı Keşk (meclis)","fa":"کشک بادمجان مجلسی","en":"Kashk Bademjan"}', null, null, 3)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 700, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Mirza Ghasemi","fa":"میرزاقاسمی","en":"Mirza Ghasemi"}', null, null, 4)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 350, 1);

  -- ── 5) سوخاری و فلافل ─────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Kızartma ve Falafel","fa":"سوخاری و فلافل","en":"Fried & Falafel"}', 5)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Tavuk Şnitzel","fa":"شنیسل مرغ","en":"Chicken Schnitzel"}', 'Chiko Slice', null, 1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 380, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Çıtır Kızarmış Fileto","fa":"فیله سوخاری پولکی","en":"Crispy Fried Fillet"}', 'Chiko Gold', null, 2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 300, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Falafel","fa":"فلافل","en":"Falafel"}', 'Veggie Ball', null, 3)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500g kap","fa":"ظرف ۵۰۰ گرمی","en":"500g container"}', 250, 1),
    (it, '{"tr":"20''li paket","fa":"بسته ۲۰ تایی","en":"Pack of 20"}', 200, 2);

  -- ── 6) ترشی ───────────────────────────────────────────────────────────────
  insert into public.categories (title, sort_order)
    values ('{"tr":"Turşu","fa":"ترشی","en":"Pickles"}', 6)
    returning id into cat;

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Bandari Turşu","fa":"ترشی بندری","en":"Bandari Pickle"}', null, null, 1)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 300, 1);

  insert into public.items (category_id, name, subtitle, ingredients, sort_order)
    values (cat, '{"tr":"Nazkhatun Turşu","fa":"ترشی نازخاتون","en":"Nazkhatun Pickle"}', null, null, 2)
    returning id into it;
  insert into public.item_prices (item_id, label, price, sort_order) values
    (it, '{"tr":"500 g","fa":"۵۰۰ گرم","en":"500 g"}', 200, 1);

end $$;
