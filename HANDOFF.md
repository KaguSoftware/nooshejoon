# نوش‌جان (Noosh Jan) — QR Menu + Admin — Handoff

> Read this first when starting a fresh chat.
> Companion: the plan file `C:\Users\MnS\.claude\plans\here-are-the-exports-adaptive-toast.md`.

## Working style
How the owner (Parsa) and Claude work together:
- **Collaborate**: agree before locking significant/user-facing decisions; propose with a recommendation.
- **Plan mode** for non-trivial work; owner approves before build. (A plan was drafted; owner has
  NOT yet approved it — do not assume build has started.)
- Owner will supply **exact hex values** and the **deployed URL** when asked — ask rather than guess.
- Use `/impeccable` skill for the frontend polish pass.
- **Make partial scope OBVIOUS**: `// SCOPE(<phase>): … GROWS LATER → …` tags + a scope-ledger row +
  an in-app "coming soon" affordance for anything shipped deliberately small.
- Keep this file and the memory index current and in lockstep.

## What this is
A digital **QR-code menu** for **نوش‌جان** ("Noosh Jan") — a **Persian restaurant operating in
Turkey** (tagline «طعم خانگی و صمیمی»). Customers scan **one QR code** on their table → open the
public menu. The menu is **multilingual (i18n): Turkish default, Persian, English** at `/tr /fa /en`.
An **admin panel** lets the owner manage **categories → items → price variants** in all three
languages (log in via Supabase Auth). Look & feel mirrors 7 Figma-exported menu cards: olive-green on
warm cream/paper, logo header, white pill title cards, shared English subtitle + ingredients line,
per-item price tiers. **Currency: Turkish Lira, shown with the ₺ mark.** Contact on last card:
Telegram/phone `05012991414`.

## Stack & environment
- **Next.js 16.2+** (App Router, TypeScript, Tailwind)
- **Supabase** (Postgres + Auth + RLS) — project ref `xfajifqdrhrgyqdlyvnh`
- **Vercel** for hosting/deploy (CLI not yet installed)
- **i18n**: locales `tr` (default), `fa`, `en` at `/tr /fa /en`; tiny custom `lib/i18n.ts` +
  `messages/*.json` for UI chrome; content translations stored as DB jsonb per locale
- Fonts: **Vazirmatn** (FA) + **Inter** (TR/EN) via `next/font/google`, font follows locale
- QR: `qrcode` lib
- Dev OS: Windows 11, PowerShell primary + Bash available
- Env keys live in `.env.local` (Supabase URL + publishable key). **No secrets in this file.**

## Conventions
- Public routes are locale-prefixed `/[locale]`; `<html lang dir>` set per locale (**FA = rtl,
  TR/EN = ltr**). `/` redirects to `/tr`. Admin is **not** locale-prefixed (single owner UI).
- Mobile-first (menu is phone-scanned).
- Digits: FA uses Persian digits via `toFa()` in `lib/fmt.ts`; TR/EN use Latin. Price formatter
  appends the **₺** mark.
- **Everything translatable**: `categories.title`, `items.name`, `items.ingredients`, and
  `item_prices.label` are **jsonb** maps `{"tr":..,"fa":..,"en":..}`. `subtitle` is shared (not
  translated). Render via `pick(field, locale)` with fallback `locale → fa → tr → first non-empty`.
- Flexible pricing: each item has 1..n `item_prices` rows (single-price items like سالاد/ترشی = one row).
- All 3 tables carry `sort_order` (drag-reorder) + `is_active` (toggle without delete).
- RLS: **public SELECT** of active rows; **authenticated-only** writes.
- Admin writes = server actions, then `revalidatePath('/', 'layout')` (refresh all locales).
- Design tokens (eyedropped from exports, tweakable): olive `#6E6E1C`, olive-deep `#5C5C16`,
  ink `#1A1A1A`, paper `#F3F1EA`→`#E9E6DD`, card `#FCFCFA`, frame `#DAD7CC`, muted `#8A8778`.

## Current status
- **Built and building clean** (`npm run build` passes; verified via Playwright screenshots at 390px).
- Public menu renders faithfully to the exports (framed paper card, logo straddling top, centered
  title pills, category chip nav, ₺ prices, Persian digits, TR/FA/EN switch). Owner has applied the
  SQL — live data confirmed in screenshot (all 7 categories/items/prices).
- Admin: login, guarded dashboard (categories), category page (items), item editor (name/ingredients
  ×3 langs + subtitle + image upload + price variants), QR page — all wired with server actions.
- **Not yet deployed.** No custom domain yet; QR is dynamic (encodes current origin at runtime).
- Playwright is a devDependency (added for screenshot verification) — harmless; can be removed later.
- Decisions locked with owner:
  - **i18n**: TR default, plus FA + EN; `/tr /fa /en` path prefixes + header switcher; per-locale
    dir & digits. Market = **Persian restaurant in Turkey** (Turkish UI, rich Persian content, EN
    for tourists). **Everything translatable** (jsonb per-locale content). Currency = **Turkish
    Lira, ₺ mark**.
  - Auth: Supabase email/password; **owner accounts created manually in Supabase dashboard** for now.
  - Pricing: **flexible named variants** (labels translated per locale).
  - Item fields: **name (×3) + shared subtitle + ingredients (×3)**.
  - Public layout: **category sections + sticky category nav** (single scroll page).
  - Colors: Claude to **eyedrop** from exports (owner may hand exact hex later).
  - Fonts: **Vazirmatn** (FA) + **Inter** (TR/EN).
  - QR: build **dynamic** (encodes current origin at runtime); owner deploys first, then gives URL.

## File map (key files — all exist)
- `app/[locale]/page.tsx` + `layout.tsx` — public menu; layout sets lang/dir/font per locale
- `app/page.tsx` — redirect `/` → `/tr` (safety net; proxy also does it)
- `app/admin/{page,login,categories/[id],items/[id],qr}` — admin panel (fa/RTL, guarded)
- `app/auth/signout/route.ts` — POST sign-out
- `app/icon.png` + `app/apple-icon.png` — favicon/app icons (copies of the logo)
- `lib/dictionaries.ts` — UI-chrome strings (inline, not JSON files)
- `utils/supabase/{server,client,middleware}.ts` — Supabase SSR; `proxy.ts` (root) = session + locale redirect
- `lib/i18n.ts` — LOCALES, DEFAULT_LOCALE, dir(), pick(field,locale) fallback
- `lib/{data,admin-data,actions,fmt,auth,types}.ts` — public queries, admin queries, server actions,
  digit/₺ formatter, requireUser guard, shared types
- `components/` — Logo, LocaleSwitcher, CategoryNav, MenuItem, Reveal; `components/admin/*` (ui, lists,
  editor, SortableList, AdminHeader, QrPanel)
- `supabase/full_setup.sql` — **run this in the Supabase SQL editor** (schema + RLS + storage + seed);
  split copies live in `supabase/migrations/0001_init.sql` + `0002_seed.sql`
- `public/logo.png` — the نوش‌جان logo (owner-provided)

**Key note:** Next 16 uses `proxy.ts` (not `middleware.ts`); function export is `proxy`. The file
`utils/supabase/middleware.ts` keeps its name but exports `updateSession` (a helper, not the entry).

## Roadmap / next steps
Steps 1–9 (scaffold → i18n → migration → public menu → admin auth → admin CRUD → QR → polish) are
**done**. Remaining:
1. **← ACTIVE: deploy to Vercel** — set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   env vars in the Vercel project; `git init` + push (repo has only `first commit` locally).
2. Create the owner's login in the Supabase **Auth** tab (email/password) so they can reach `/admin`.
3. After deploy, open `/admin/qr`, print/download the QR (it auto-encodes the deployed origin).
4. Optional: connect a custom domain; the QR page regenerates against it automatically.
5. Optional cleanup: remove `playwright` devDependency; refine TR/EN seed copy in admin.

## Deliberately partial — grows later (scope ledger)
| Area | What shipped now | Intended full shape | Grows in |
|------|------------------|---------------------|----------|
| Auth | Manual Supabase-dashboard accounts, email/password | Self-serve multi-staff, roles | Later phase |
| Items | name/subtitle/ingredients + **image** + prices | Availability schedule | Later phase |
| QR | Single dynamic QR to `/` | Per-table / custom-domain QR | After deploy |
| TR/EN copy | First-pass seed translations | Owner-refined in admin | Ongoing |
| i18n | Tiny custom `lib/i18n.ts` + `lib/dictionaries.ts` | `next-intl` if surface grows | If needed |

## Gotchas / open issues
- Owner must (a) create the owner's login in the Supabase **Auth** tab, (b) deploy then read the QR
  from `/admin/qr`. Logo + SQL are already done.
- **Next 16: `proxy.ts` not `middleware.ts`** — build log confirms "Proxy (Middleware)". Don't
  re-add a `middleware.ts`; the Supabase helper `utils/supabase/middleware.ts` is just a helper file.
- Item images go to the public Supabase Storage bucket `item-images` (created by `full_setup.sql`).
  `next.config.ts` allow-lists the Supabase host for `next/image`.
- Keys in `.env.local` are the **publishable** key (public read is by design via RLS) — never put a
  service-role/secret key in client-exposed env or in docs. Also set both vars in Vercel at deploy.
- Vercel CLI not installed (`npm i -g vercel` to unlock `vercel deploy`/`env pull`).
- `playwright` is a devDependency added only for screenshot verification — safe to remove.

## Running it
- `npm install` → `npm run dev` (local) → `npm run build` (pre-deploy check; currently green).
- **DB**: run `supabase/full_setup.sql` in the Supabase SQL editor (already applied by owner).
- Deploy via Vercel; set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` env vars.
