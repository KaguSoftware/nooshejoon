"use client";

import { useEffect, useRef, useState } from "react";

type Chip = { id: string; label: string };

export function CategoryNav({ chips }: { chips: Chip[] }) {
  const [active, setActive] = useState(chips[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const sections = chips
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("cat-", ""));
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [chips]);

  // Keep the active chip centered in the strip so the customer always sees
  // there are more categories on both sides (first/last naturally rest at the ends).
  useEffect(() => {
    const strip = stripRef.current;
    const btn = active ? btnRefs.current[active] : null;
    if (!strip || !btn) return;
    const target =
      btn.offsetLeft - strip.clientWidth / 2 + btn.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  function go(id: string) {
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return (
    <nav className="sticky top-2 z-20 rounded-full border border-frame/50 bg-paper-top/90 px-1.5 py-1.5 backdrop-blur-md">
      <div ref={stripRef} className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {chips.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              ref={(el) => {
                btnRefs.current[c.id] = el;
              }}
              onClick={() => go(c.id)}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1.5 text-[0.8rem] font-medium transition-all duration-200",
                isActive
                  ? "bg-olive text-white shadow-sm"
                  : "text-olive-deep/80 hover:bg-card hover:text-olive-deep active:scale-95",
              ].join(" ")}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
