import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVars } from "../fonts";
import { LOCALES, dir, isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "نوش‌جان | Noosh Jan",
  description: "منوی نوش‌جان — طعم خانگی و صمیمی",
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dir(locale)} className={`${fontVars} h-full`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
