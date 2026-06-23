import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";

// 英文: Geist (300/400/500/600)
export const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});

// 等幅: Geist Mono (400/500) — ラベル・番号・URL・記号に使用
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

// 和文: Zen Kaku Gothic New (400/500/700)
export const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen",
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${zenKaku.variable}`;
