import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESC } from "@/lib/site";

// Web App Manifest。Next.js がこのファイルを見つけると <link rel="manifest"> を自動で出す。
//
// 効くのは主に Android で「ホーム画面に追加」した時。
// 未設置だとアイコンの下にページタイトルがそのまま並んで長くなる。
// 名前と説明とアイコンをここで指定して短く整える。
//
// display は "browser" にしてある。このサイトは読み物であってアプリではないため
// アドレスバーを隠す standalone にすると URL をコピーして共有しづらくなる。
// インストール可能なPWAにする意図も無い。
//
// アイコンは既存の2つを指す。192/512 の PNG は用意していない。
// 近年の Chrome は SVG を受け付けるうえ 印はロゴと同じ S 一種類なので
// サイズ違いを増やしても得るものが無い。必要になった時点で足す。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    // ホーム画面のアイコン下に出る短い名前。ロゴとファビコンの S に合わせる
    short_name: "SHIN",
    description: SITE_DESC,
    lang: "ja",
    start_url: "/",
    display: "browser",
    // layout.tsx の viewport.themeColor と同じライト側の背景色に揃える
    background_color: "#f4f3ef",
    theme_color: "#f4f3ef",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
