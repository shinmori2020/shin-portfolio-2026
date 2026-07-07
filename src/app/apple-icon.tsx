// Apple touch icon（180px・生成PNG）。iOSが角丸を付けるため全面オフホワイト＋深緑の点のみ。
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background: "#f4f3ef",
        }}
      >
        <div style={{ width: 82, height: 82, borderRadius: "50%", background: "#214034" }} />
      </div>
    ),
    size,
  );
}
