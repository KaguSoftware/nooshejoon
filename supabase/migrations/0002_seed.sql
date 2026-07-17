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
