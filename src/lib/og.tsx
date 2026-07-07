// OG画像の共通デザイン（1200x630）。サイトと同じ人格＝オフホワイト背景＋深緑の差し色＋タイポ。
// 写真・グラデ・装飾過多は禁止。ここが「画像ソースの唯一の差し替え点」。
// 将来デザインPNGへ差し替える場合は 各 opengraph-image ルートをこの関数呼び出しから
// 静的ファイル(app/opengraph-image.png 等)に置き換えるだけでよい。

import { ImageResponse } from "next/og";
import { loadOgFonts, OG_FONT_FAMILY } from "./ogFont";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

// サイトのデザイントークン（ライト）をそのまま定数化（ImageResponseはCSS変数を読めないため）
const BG = "#f4f3ef";
const INK = "#191b18";
const MUTED = "#6b6e66";
const FAINT = "#9b9d94";
const ACCENT = "#214034";
const LINE = "#e2dfd2";

function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 6) return 118;
  if (len <= 14) return 76;
  if (len <= 22) return 58;
  return 46;
}

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): Promise<ImageResponse> {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          position: "relative",
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        {/* 組版方眼の気配（細い縦罫でコンテンツ列を挟む） */}
        <div style={{ position: "absolute", top: 0, left: 150, width: 1, height: "100%", background: LINE }} />
        <div style={{ position: "absolute", top: 0, right: 150, width: 1, height: "100%", background: LINE }} />

        {/* eyebrow（モノ風・レター詰め） */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 78 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT }} />
          <div style={{ display: "flex", color: ACCENT, fontSize: 26, fontWeight: 500, letterSpacing: 6 }}>
            {eyebrow}
          </div>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 78, maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleFontSize(title),
              fontWeight: 700,
              color: INK,
              lineHeight: 1.16,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {/* 差し色: 深緑の下線 */}
          <div style={{ width: 132, height: 8, borderRadius: 4, background: ACCENT, marginTop: 30 }} />
          <div style={{ display: "flex", fontSize: 34, color: MUTED, marginTop: 30 }}>{subtitle}</div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 78,
            color: FAINT,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>シン｜フロントエンド・WEB制作</div>
          <div style={{ display: "flex", letterSpacing: 1 }}>shin-portfolio-2026.vercel.app</div>
        </div>
      </div>
    ),
    { width: OG_SIZE.width, height: OG_SIZE.height, fonts: fonts.length ? fonts : undefined },
  );
}
