"use client";

import { useState } from "react";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";

// ── Custom toggle switch ─────────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  labelOn = "فعال",
  labelOff = "مخفی",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-muted"
    >
      <span
        className={[
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-olive" : "bg-frame",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-0.5" : "left-[22px]",
          ].join(" ")}
        />
      </span>
      <span>{checked ? labelOn : labelOff}</span>
    </button>
  );
}

// ── Multilingual field (3 tabs: TR / FA / EN) ───────────────────────────────
export function LocaleField({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: Partial<Record<Locale, string>>;
  onChange: (v: Partial<Record<Locale, string>>) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<Locale>("fa");

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-ink/80">{label}</label>
        <div className="inline-flex gap-1 rounded-lg bg-paper-bottom p-0.5">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={[
                "rounded-md px-2 py-0.5 text-xs transition-colors",
                tab === l
                  ? "bg-olive text-white"
                  : "text-muted hover:text-olive-deep",
              ].join(" ")}
            >
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
      </div>
      {textarea ? (
        <textarea
          className="field min-h-20 resize-y"
          dir={tab === "fa" ? "rtl" : "ltr"}
          placeholder={placeholder}
          value={value[tab] ?? ""}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
        />
      ) : (
        <input
          className="field"
          dir={tab === "fa" ? "rtl" : "ltr"}
          placeholder={placeholder}
          value={value[tab] ?? ""}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
        />
      )}
      <p className="mt-1 text-xs text-muted">
        زبان فعال: {LOCALE_NAMES[tab]} — سایر زبان‌ها را هم پر کنید
      </p>
    </div>
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  const cls = {
    primary: "bg-olive text-white hover:bg-olive-deep",
    ghost:
      "bg-card text-olive-deep ring-1 ring-frame hover:ring-olive/40",
    danger: "bg-red-600/90 text-white hover:bg-red-600",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${cls}`}
    >
      {children}
    </button>
  );
}
