// 撮影対象の案件リスト（設定とデータの分離）。
// ここは「人間が実URLを記入する場所」。撮影スクリプト本体(capture-works.mjs)は触らずここだけ編集する。
//
// 各要素:
//   slug     必須  保存先 public/works/{slug}/cover.png のキー（works.ts の slug に一致させる）
//   url      必須  撮影する公開サイトの URL
//   dismiss  任意  撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー等）。9割の案件で不要
//   waitMs   任意  ページ表示後の追加待機ミリ秒（遅延読み込みの重い案件用）。既定 0
//   fullPage 任意  true でページ全体を縦長撮影（既定 false = ファーストビューのみ）
//
// 初期値はダミー1件。実案件の slug/url へ書き換えて `npm run capture` を実行する。

/** @typedef {{ slug: string, url: string, dismiss?: string, waitMs?: number, fullPage?: boolean }} Target */

/** @type {Target[]} */
export const targets = [
  {
    slug: '_sample',
    url: 'https://example.com',
  },
  // 実案件の例（コメントを外して url を実URLに差し替える）:
  // { slug: 'headless-wp-media', url: 'https://example.com' },
  // { slug: 'multilingual-ec',   url: 'https://example.com' },
  // { slug: 'estimate-simulator', url: 'https://example.com' },
  // { slug: 'proposal-builder',  url: 'https://example.com' },
];
