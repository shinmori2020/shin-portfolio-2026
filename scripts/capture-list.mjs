// 撮影対象の案件リスト（設定とデータの分離）。
// ここは「人間が実URLを記入する場所」。撮影スクリプト本体(capture-works.mjs)は触らずここだけ編集する。
//
// 各要素:
//   slug     必須  保存先 public/works/{slug}/ のキー（works.ts の slug に一致させる）
//   url      必須  撮影する公開サイトの URL
//   out      任意  出力ファイル名（既定 cover.png）。縦長全景は full.png を指定する
//   dismiss  任意  撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー・初期モーダル等）
//   waitMs   任意  ページ表示後の追加待機ミリ秒（遅延読み込み・背景アニメの頃合い調整）。既定 0
//   fullPage 任意  true でページ全体を縦長撮影（既定 false = ファーストビューのみ）
//   reducedMotion 任意  既定 'reduce'（登場アニメ途中を写さない）。背景アニメが常時動く案件は
//                       'no-preference' にしないと崩れた中間状態で凍結する（下の nordic 参照）
//
// cover.png（ファーストビュー）と full.png（fullPage:true の縦長全景）を slug ごとに2件ずつ並べる。
// 既存を上書きしたくない時は out 単位で存在判定する --skip-existing を使う。
// 注意: この環境の npm は `-- <flag>` をスクリプトへ渡さないため フラグ付き実行は node を直接叩く:
//   node scripts/capture-works.mjs --skip-existing   （既存 cover/full を残し 無い分だけ撮影）
//   node scripts/capture-works.mjs --slug=foo         （1案件だけ / --list で対象確認）

/** @typedef {{ slug: string, url: string, out?: string, dismiss?: string, waitMs?: number, fullPage?: boolean, reducedMotion?: 'reduce' | 'no-preference' }} Target */

// nordic-works の共通指定（cover / full で同じ条件にする）。
// - dismiss: Cookie バナーを「拒否する」で閉じる（バナーが出るのはこの案件のみ）
// - reducedMotion: 'no-preference' … ヒーローの波紋は常時動く背景アニメで 既定の reduce だと
//   崩れた中間状態で凍結し 重い輪郭が写ってしまう。アニメを動かして自然な波紋を撮る。
// - waitMs: 1500 … 波紋が落ち着き渦がほどよく残る頃合い（人間が候補比較のうえ選定）
const NORDIC = {
  url: 'https://nordic-works.vercel.app/',
  dismiss: 'text=拒否する',
  reducedMotion: /** @type {const} */ ('no-preference'),
  waitMs: 1500,
};

// proposal-builder は初回表示で「業種テンプレートを選択」モーダル(z-50 の全画面)が出て
// UI 本体が隠れるため「キャンセル」で閉じてから撮る。
const PROPOSAL = {
  url: 'https://proposal-builder-flame.vercel.app/',
  dismiss: 'text=キャンセル',
};

/** @type {Target[]} */
export const targets = [
  // --- ファーストビュー（cover.png） ---
  { slug: 'headless-wp-media',  ...NORDIC },
  { slug: 'multilingual-ec',    url: 'https://stillne-shop.vercel.app/ja' },
  { slug: 'estimate-simulator', url: 'https://mitsumo-project.vercel.app/' },
  { slug: 'proposal-builder',   ...PROPOSAL },
  // --- 縦長全景（full.png・ライトボックス用） ---
  { slug: 'headless-wp-media',  ...NORDIC,   out: 'full.png', fullPage: true },
  { slug: 'multilingual-ec',    url: 'https://stillne-shop.vercel.app/ja', out: 'full.png', fullPage: true },
  { slug: 'estimate-simulator', url: 'https://mitsumo-project.vercel.app/', out: 'full.png', fullPage: true },
  { slug: 'proposal-builder',   ...PROPOSAL, out: 'full.png', fullPage: true },
];
