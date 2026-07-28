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
//
// preload: false は必須。和文フォントは Unicode 範囲で約90分割されており
// next/font の既定(preload: true)だと全サブセット × 全ウェイトぶんの
// <link rel="preload"> が HTML に並ぶ。実測で 241件 / 3.0MB が初回に落ちてきて
// 回線を占有し LCP が 18.3秒まで悪化していた。
//
// preload を切っても @font-face の unicode-range 指定は残るため、
// ブラウザは実際に使う文字の分だけを遅延取得する。表示は display: swap で
// 先に代替フォントが出るので文字が消えることはない。
// 欧文(Geist / Geist Mono)は分割数が少なく先読みの効果が上回るため既定のまま。
export const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen",
  display: "swap",
  preload: false,
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${zenKaku.variable}`;
