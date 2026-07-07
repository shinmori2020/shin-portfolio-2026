// 制作物の実画像「置くだけで反映」規約の解決層（サーバ専用・ビルド時にファイル探索）。
//
// 規約:
//   public/works/{slug}/cover.{webp,png,jpg}  … 一覧カード・詳細ヒーロー・ヒーローカード共用
//   public/works/{slug}/full.{webp,png,jpg}   … 詳細ライトボックスの縦長全景（任意）
//
// データ(works.ts)の image / imageFull が明示されていればそれを優先し、
// なければ上記規約パスを探索。無ければ undefined を返し 各表示側が斜線プレースホルダーへ自動フォールバックする。
//
// 注意: node:fs を使うためサーバコンポーネント/ビルド時専用。クライアントコンポーネントから import しないこと。

import fs from "node:fs";
import path from "node:path";

const EXTS = ["webp", "png", "jpg", "jpeg", "avif"] as const;
const PUBLIC_DIR = path.join(process.cwd(), "public");

function findInWorks(slug: string, base: string): string | undefined {
  for (const ext of EXTS) {
    const rel = `works/${slug}/${base}.${ext}`;
    if (fs.existsSync(path.join(PUBLIC_DIR, rel))) return `/${rel}`;
  }
  return undefined;
}

/** カバー画像（一覧・詳細ヒーロー・ヒーローカード共用）。明示値を優先し なければ cover.* を探索 */
export function resolveWorkCover(slug: string, explicit?: string): string | undefined {
  return explicit ?? findInWorks(slug, "cover");
}

/** 全景画像（詳細ライトボックス）。明示値を優先し なければ full.* を探索 */
export function resolveWorkFull(slug: string, explicit?: string): string | undefined {
  return explicit ?? findInWorks(slug, "full");
}
