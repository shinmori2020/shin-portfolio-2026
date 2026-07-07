// OG画像用フォントローダ。satori は woff2 非対応のため Google Fonts の CSS2 サブセット
// (woff2) は使えない。google/fonts ミラー(jsDelivr)から TTF を取得する＝満漢字カバーで
// 動的な案件タイトルも欠字しない。ビルド内で一度だけ取得しキャッシュする。
// 取得失敗時は空配列を返し ImageResponse は既定フォントで描画する（ビルドは落とさない）。

const FAMILY = "Zen Kaku Gothic New";

const SOURCES = {
  500: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zenkakugothicnew/ZenKakuGothicNew-Medium.ttf",
  700: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zenkakugothicnew/ZenKakuGothicNew-Bold.ttf",
} as const;

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 700;
  style: "normal";
};

let cache: Promise<OgFont[]> | null = null;

async function fetchTtf(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

async function load(): Promise<OgFont[]> {
  const [medium, bold] = await Promise.all([fetchTtf(SOURCES[500]), fetchTtf(SOURCES[700])]);
  const fonts: OgFont[] = [];
  if (medium) fonts.push({ name: FAMILY, data: medium, weight: 500, style: "normal" });
  if (bold) fonts.push({ name: FAMILY, data: bold, weight: 700, style: "normal" });
  return fonts;
}

export function loadOgFonts(): Promise<OgFont[]> {
  if (!cache) cache = load();
  return cache;
}

export const OG_FONT_FAMILY = FAMILY;
