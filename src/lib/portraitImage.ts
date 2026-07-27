// ポートレート画像「置くだけで反映」規約の解決層（サーバ専用・ビルド時にファイル探索）。
// 制作物画像(workImages.ts)と同じ考え方で 置き場所と探索順だけが違う。
//
// 規約:
//   public/profile/portrait.{webp,png,jpg,jpeg,avif} … /profile と Home の About で共用
//
// 無ければ undefined を返し 表示側が斜線プレースホルダーへ自動フォールバックする。
//
// 注意: node:fs を使うためサーバコンポーネント/ビルド時専用。クライアントコンポーネントから import しないこと。

import fs from "node:fs";
import path from "node:path";

const EXTS = ["webp", "png", "jpg", "jpeg", "avif"] as const;
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** ポートレート画像。未用意なら undefined */
export function resolvePortrait(): string | undefined {
  for (const ext of EXTS) {
    const rel = `profile/portrait.${ext}`;
    if (fs.existsSync(path.join(PUBLIC_DIR, rel))) return `/${rel}`;
  }
  return undefined;
}
