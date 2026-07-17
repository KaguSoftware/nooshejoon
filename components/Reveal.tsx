"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Content is visible by default (SSR-safe, headless-safe). When motion is
 * allowed and JS runs, it starts slightly translated/faded and settles on
 * scroll-in. Reduced-motion users get the plain visible content.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    setEnabled(true);

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        enabled
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translateY(14px)",
              transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
