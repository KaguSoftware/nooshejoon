import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getMenu } from "@/lib/data";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CategoryNav } from "@/components/CategoryNav";
import { MenuItem } from "@/components/MenuItem";
import { Reveal } from "@/components/Reveal";

export const revalidate = 60;

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const menu = await getMenu();
  const chips = menu.map((c) => ({ id: c.id, label: pick(c.title, locale) }));

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[30rem] px-3 pb-10 pt-16 sm:px-4">
      {/* Logo straddles the top edge of the framed paper card (as in the exports). */}
      <div className="relative">
        <div className="absolute inset-x-0 -top-11 z-10 flex justify-center">
          <Logo size={128} />
        </div>

        <main className="rounded-[2rem] border border-frame/70 bg-card/40 px-4 pb-10 pt-24 shadow-[0_1px_0_rgba(255,255,255,0.6),0_18px_40px_-28px_rgba(90,92,22,0.35)] sm:px-5">
          {/* Language switcher — subtle, under the logo */}
          <div className="mb-6 flex justify-center">
            <LocaleSwitcher current={locale} />
          </div>

          {menu.length === 0 ? (
            <p className="py-24 text-center text-muted">{t.empty}</p>
          ) : (
            <>
              {chips.length > 0 && <CategoryNav chips={chips} />}

              <div className="mt-6 space-y-12">
                {menu.map((cat) => (
                  <section
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    className="scroll-mt-24"
                  >
                    <Reveal>
                      <h2 className="mb-5 text-center text-[1.7rem] font-extrabold tracking-tight text-ink">
                        {pick(cat.title, locale)}
                      </h2>
                    </Reveal>
                    <div className="space-y-6">
                      {cat.items.map((item, i) => (
                        <Reveal key={item.id} delay={Math.min(i * 60, 240)}>
                          <MenuItem item={item} locale={locale} />
                        </Reveal>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}

          <footer className="mt-14 flex flex-col items-center gap-2 border-t border-frame/50 pt-8 text-olive-deep">
            <a
              href="https://t.me/05012991414"
              className="flex items-center gap-2 text-lg font-bold tabular-nums transition-opacity hover:opacity-70"
              dir="ltr"
            >
              <TelegramIcon /> 05012991414
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 3 2 10.5l6.5 2.5L11 20l3-4 5 3z" />
    </svg>
  );
}
