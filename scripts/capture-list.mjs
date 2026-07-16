// 撮影対象の案件リスト（設定とデータの分離）。
// ここは「人間が実URLを記入する場所」。撮影スクリプト本体(capture-works.mjs)は触らずここだけ編集する。
//
// 各要素:
//   slug     必須  保存先 public/works/{slug}/ のキー（works.ts の slug に一致させる）
//   url      必須  撮影する公開サイトの URL
//   out      任意  出力ファイル名（既定 cover.png）。縦長全景は full.png を指定する
//   dismiss  任意  撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー等）。9割の案件で不要
//   waitMs   任意  ページ表示後の追加待機ミリ秒（遅延読み込みの重い案件用）。既定 0
//   fullPage 任意  true でページ全体を縦長撮影（既定 false = ファーストビューのみ）
//
// cover.png（ファーストビュー）と full.png（fullPage:true の縦長全景）を slug ごとに2件ずつ並べる。
// 既存を上書きしたくない時は out 単位で存在判定する --skip-existing を使う。
// 注意: この環境の npm は `-- <flag>` をスクリプトへ渡さないため フラグ付き実行は node を直接叩く:
//   node scripts/capture-works.mjs --skip-existing   （既存 cover/full を残し 無い分だけ撮影）
//   node scripts/capture-works.mjs --slug=foo         （1案件だけ / --list で対象確認）

/** @typedef {{ slug: string, url: string, out?: string, dismiss?: string, waitMs?: number, fullPage?: boolean }} Target */

/** @type {Target[]} */
export const targets = [
  // --- ファーストビュー（cover.png） ---
  // nordic-works のみ Cookie バナーが出るため撮影前に「拒否する」で閉じる（他3案件はバナー無し）
  { slug: 'headless-wp-media',  url: 'https://nordic-works.vercel.app/', dismiss: 'text=拒否する' },
  { slug: 'multilingual-ec',    url: 'https://stillne-shop.vercel.app/ja' },
  { slug: 'estimate-simulator', url: 'https://mitsumo-project.vercel.app/' },
  { slug: 'proposal-builder',   url: 'https://proposal-builder-flame.vercel.app/' },
  // --- 縦長全景（full.png・ライトボックス用） ---
  { slug: 'headless-wp-media',  url: 'https://nordic-works.vercel.app/',           out: 'full.png', fullPage: true, dismiss: 'text=拒否する' },
  { slug: 'multilingual-ec',    url: 'https://stillne-shop.vercel.app/ja',         out: 'full.png', fullPage: true },
  { slug: 'estimate-simulator', url: 'https://mitsumo-project.vercel.app/',        out: 'full.png', fullPage: true },
  { slug: 'proposal-builder',   url: 'https://proposal-builder-flame.vercel.app/', out: 'full.png', fullPage: true },
];
