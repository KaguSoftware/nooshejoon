import { Inter, Vazirmatn } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

// Both variables applied at the top so either font is available; the active one
// is chosen in CSS by [lang].
export const fontVars = `${inter.variable} ${vazirmatn.variable}`;
