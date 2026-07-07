// サイト共通のOG画像（トップおよび個別指定のない全ページ）。ビルド時に静的化される。
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "シン — WEB制作・コーディング";

export default async function Image() {
  return renderOgImage({
    eyebrow: "PORTFOLIO — 2026",
    title: "シン",
    subtitle: "WEB制作・コーディング",
  });
}
