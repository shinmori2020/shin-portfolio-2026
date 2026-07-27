// サイト全体で共有する定数。layout / sitemap / robots / 構造化データが同じ値を見るようにする。
//
// 本番URLは Vercel の環境変数 NEXT_PUBLIC_SITE_URL で差し替えられる。
// 独自ドメインを取ったらここではなく環境変数を設定する（コード変更は不要）。

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shin-portfolio-2026.vercel.app";
export const SITE_NAME = "シン — WEB制作・コーディング";
export const SITE_DESC =
  "制作と開発の“あいだ”をつなぐフロントエンドエンジニア。WordPressの制作現場からNext.jsのモダン実装まで一貫して対応します。";

/** サイト運営者。構造化データ(JSON-LD)で使う */
export const AUTHOR_NAME = "シン";
export const AUTHOR_ROLE = "Frontend Engineer / Web Developer";

/** 絶対URLを作る（JSON-LD は相対パスを解決しないため必要） */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
