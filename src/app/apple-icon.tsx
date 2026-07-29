// Apple touch icon（180px・生成PNG）。iOS 側が角丸を付けるため 角丸は持たせず全面に敷く。
// 印は icon.svg と同じ S モノグラム（ロゴ SHIN の頭文字を円弧2本で組んだもの）。
// 両者がずれないよう ここでも同じ path とサイズ比（viewBox 0 0 32 32）を使う。
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// ImageResponse の描画エンジンは CSS 変数を読めないため トークンの実値を直接書く。
const GROUND = "#f4f3ef";
const INK = "#214034";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: GROUND,
        }}
      >
        {/* icon.svg と同一の path。値がずれると2つの印が食い違うため 変更時は両方直す */}
        <svg width={180} height={180} viewBox="0 0 32 32">
          <path
            d="M20.8 8.2 A5 5 0 1 0 16 16 A5 5 0 1 1 11.2 23.8"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
