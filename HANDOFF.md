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
- **Nothing built yet.** Repo is empty (`first commit` + placeholder README only).
- Requirements gathered & a full plan drafted (see plan file). Owner **rejected the ExitPlanMode**
  and asked to run `/handoff` first — so plan is **not yet approved**; re-confirm before building.
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

## File map (planned — none exist yet)
- `app/[locale]/page.tsx` + `app/[locale]/layout.tsx` — public menu; layout sets lang/dir/font/dict
- `app/page.tsx` — redirect `/` → `/tr`
- `app/admin/*` — login, dashboard, category/item edit (3-language fields), `qr` page
- `messages/{tr,fa,en}.json` — UI-chrome dictionaries
- `utils/supabase/{server,client,middleware}.ts` + root `middleware.ts` — Supabase SSR + locale redirect
- `lib/i18n.ts` — LOCALES, DEFAULT_LOCALE, dir(), pick(field,locale) fallback, t(dict,key)
- `lib/{data,actions,fmt}.ts` — queries, server-action mutations, digit/₺-price formatter
- `supabase/migrations/0001_init.sql` — jsonb tables + RLS + 3-language seed from the 7 exports
- `public/logo.png` — نوش‌جان logo (owner to drop in)

## Roadmap / next steps
1. **← ACTIVE: get plan approved** (re-run ExitPlanMode) before writing code.
2. Scaffold Next.js (TS + Tailwind), fonts, tokens; `lib/i18n.ts` + `messages/*.json`;
   `[locale]/layout.tsx` sets lang/dir/font.
3. Supabase util files + middleware (session refresh + `/` → `/tr` redirect).
4. SQL migration: **jsonb** tables, RLS, **3-language seed** of the 7 categories/items/prices.
5. Public menu + components + `LocaleSwitcher` + `lib/fmt.ts`.
6. Admin auth (login + guarded layout + signout).
7. Admin CRUD + drag-reorder with **per-language fields** (server actions).
8. `/admin/qr` printable dynamic QR.
9. `/impeccable` polish pass on the public menu (all three locales).
10. Add `public/logo.png`; run + verify; hand off for deploy; then wire QR to final URL.

## Deliberately partial — grows later (scope ledger)
| Area | What shipped now | Intended full shape | Grows in |
|------|------------------|---------------------|----------|
| Auth | Manual Supabase-dashboard accounts, email/password | Self-serve multi-staff, roles | Later phase |
| Items | name/subtitle/ingredients + prices | Per-item image, availability schedule | Later phase |
| QR | Single dynamic QR to `/` | Per-table / custom-domain QR | After deploy |
| TR/EN copy | First-pass seed translations | Owner-refined in admin | Ongoing |
| i18n | Tiny custom `lib/i18n.ts` + JSON dicts | `next-intl` if surface grows | If needed |

## Gotchas / open issues
- **Plan not approved yet** — confirm before building.
- Owner must (a) create the owner's login in the Supabase **Auth** tab, (b) drop the logo at
  `public/logo.png`, (c) deploy then provide the live URL for the QR.
- Vercel CLI not installed (`npm i -g vercel` to unlock `vercel deploy`/`env pull`).
- Keys in `.env.local` are the **publishable** key (public read is by design via RLS) — never put a
  service-role/secret key in client-exposed env or in docs.
- README currently has a typo/encoding artifact ("nooshejoon") — harmless.

## Running it
Not runnable yet. After scaffold:
- `npm install` → `npm run dev` (local), `npm run build` (pre-deploy check)
- Deploy via Vercel (set the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel project).
