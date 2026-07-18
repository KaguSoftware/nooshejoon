-- Regroup live data:
--   1) "Börek & Dolma" category → renamed to "Börek"; keeps the 3 böreks.
--   2) The 2 meat böreks move from "Börek & Samosa" into "Börek".
--   3) "Börek & Samosa" category → renamed to "Dolma & Samosa"; Dolma moves in,
--      Samosa stays. Böreks leave.
--
-- Matches rows by the Persian (fa) name/title so it is independent of UUIDs.
-- Idempotent: safe to re-run (final state is the same).

do $$
declare
  cat_borek uuid;   -- becomes the "Börek" category (was "Börek & Dolma")
  cat_ds    uuid;   -- becomes the "Dolma & Samosa" category (was "Börek & Samosa")
begin
  select id into cat_borek from public.categories where title->>'fa' in ('بورک و دلمه','بورک') limit 1;
  select id into cat_ds    from public.categories where title->>'fa' in ('بورک و سمبوسه','دلمه و سمبوسه') limit 1;

  if cat_borek is null or cat_ds is null then
    raise notice 'expected categories not found — nothing to do';
    return;
  end if;

  -- Rename categories.
  update public.categories
    set title = '{"tr":"Börek","fa":"بورک","en":"Börek"}'
    where id = cat_borek;
  update public.categories
    set title = '{"tr":"Dolma ve Samosa","fa":"دلمه و سمبوسه","en":"Dolma & Samosa"}'
    where id = cat_ds;

  -- Move the two meat böreks into the Börek category.
  update public.items
    set category_id = cat_borek, sort_order = 4
    where name->>'fa' = 'بورک گوشت';
  update public.items
    set category_id = cat_borek, sort_order = 5
    where name->>'fa' = 'بورک گوشت و بادمجان';

  -- Keep the original three böreks ordered 1–3.
  update public.items set sort_order = 1 where name->>'fa' = 'بورک مرغ';
  update public.items set sort_order = 2 where name->>'fa' = 'بورک اسفناج';
  update public.items set sort_order = 3 where name->>'fa' = 'بورک سیب‌زمینی و مرغ';

  -- Move Dolma into the Dolma & Samosa category.
  update public.items
    set category_id = cat_ds, sort_order = 1
    where name->>'fa' = 'دلمه';
  -- Samosa stays; just fix its order.
  update public.items
    set sort_order = 2
    where name->>'fa' = 'سمبوسه';
end $$;
