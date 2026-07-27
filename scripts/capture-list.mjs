// 撮影対象の案件リスト（設定とデータの分離）。
// ここは「人間が実URLを記入する場所」。撮影スクリプト本体(capture-works.mjs)は触らずここだけ編集する。
//
// 各要素:
//   slug     必須  保存先 public/works/{slug}/ のキー（works.ts の slug に一致させる）
//   url      必須  撮影する公開サイトの URL
//   out      任意  出力ファイル名（既定 cover.png）。縦長全景は full.png を指定する
//   dismiss  任意  撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー・初期モーダル等）
//   hide     任意  撮影前に display:none にする CSS セレクタの配列。クリックすると閉じるどころか
//                  展開してしまうウィジェット（チャットボット等）は dismiss では消せないためこちらを使う
//   waitMs   任意  ページ表示後の追加待機ミリ秒（遅延読み込み・背景アニメの頃合い調整）。既定 0
//   fullHeightUntil 任意  fullPage をこの要素の下端で打ち切る CSS セレクタ。スクロール連動
//                  スライダーの「スクロール量を稼ぐ背の高い余白」が白紙で写るのを避ける用
//   fullPage 任意  true でページ全体を縦長撮影（既定 false = ファーストビューのみ）
//   reducedMotion 任意  既定 'reduce'（登場アニメ途中を写さない）。背景アニメが常時動く案件は
//                       'no-preference' にしないと崩れた中間状態で凍結する（下の nordic 参照）
//
// cover.png（ファーストビュー）と full.png（fullPage:true の縦長全景）を slug ごとに2件ずつ並べる。
// 既存を上書きしたくない時は out 単位で存在判定する --skip-existing を使う。
// 注意: この環境の npm は `-- <flag>` をスクリプトへ渡さないため フラグ付き実行は node を直接叩く:
//   node scripts/capture-works.mjs --skip-existing   （既存 cover/full を残し 無い分だけ撮影）
//   node scripts/capture-works.mjs --slug=foo         （1案件だけ / --list で対象確認）

/** @typedef {{ slug: string, url: string, out?: string, dismiss?: string, hide?: string[], fullHeightUntil?: string, waitMs?: number, fullPage?: boolean, reducedMotion?: 'reduce' | 'no-preference' }} Target */

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

// slider-patterns の事情2つ:
// - reducedMotion: 自動再生スライダーが常時動くため 既定の reduce だと崩れた中間状態で
//   凍結する（nordic と同じ問題）。アニメを動かしたうえで waitMs で頃合いを取る。
//   撮るたび絵が変わる前提の案件。
// - fullHeightUntil: 最後のスライダー07(フルスクリーン縦スクロール)は
//   「4500px のスクロール余白 + 900px の sticky パネル」で出来ている。余白はスクロール量を
//   稼ぐためだけのもので 静止画では 3600px が白紙で写る。sticky パネル(.slider-fullscreen)の
//   下端で打ち切れば 07 の1画面目までを見せて余白を落とせる。
const SLIDER = {
  url: 'https://slider-project-demo.netlify.app/',
  reducedMotion: /** @type {const} */ ('no-preference'),
  waitMs: 1200,
  fullHeightUntil: '.slider-fullscreen',
};

// gradientr は SPA(Vite)。初期描画が JS 完了後になるため 少し待ってから撮る。
const GRADIENTR = {
  url: 'https://gradientr.netlify.app/',
  waitMs: 1200,
};

// web-creation-service の事情2つ:
// - hide: 右下のチャットボット(#chatbot)は固定配置。クリックすると展開するため dismiss では消せず
//   fullPage ではヒーローに焼き込まれる。表示ごと落とす。
// - waitMs: ヒーローの肩書きが1文字ずつ出るタイピング演出。約300ms/文字で
//   "Frontend Engineer"(17文字)を打ち切るのに5秒強かかる。途中で撮ると "Fronte" のように欠ける。
const MISSIONS = {
  url: 'https://web-creation-service.netlify.app/',
  hide: ['#chatbot'],
  waitMs: 6000,
};

/** @type {Target[]} */
export const targets = [
  // --- ファーストビュー（cover.png） ---
  { slug: 'headless-wp-media',    ...NORDIC },
  { slug: 'multilingual-ec',      url: 'https://stillne-shop.vercel.app/ja' },
  { slug: 'estimate-simulator',   url: 'https://mitsumo-project.vercel.app/' },
  { slug: 'proposal-builder',     ...PROPOSAL },
  { slug: 'gradientr',            ...GRADIENTR },
  { slug: 'web-creation-service', ...MISSIONS },
  { slug: 'slider-patterns',      ...SLIDER },
  { slug: 'web-parts-reference',  url: 'https://web-parts-reference.netlify.app/' },
  // --- 縦長全景（full.png・ライトボックス用） ---
  { slug: 'headless-wp-media',    ...NORDIC,    out: 'full.png', fullPage: true },
  { slug: 'multilingual-ec',      url: 'https://stillne-shop.vercel.app/ja', out: 'full.png', fullPage: true },
  { slug: 'estimate-simulator',   url: 'https://mitsumo-project.vercel.app/', out: 'full.png', fullPage: true },
  { slug: 'proposal-builder',     ...PROPOSAL,  out: 'full.png', fullPage: true },
  // gradientr は full を撮らない。scrollHeight がビューポートと同値(1440x900)の1画面完結UIで
  // 全景を撮っても cover と同じ絵になる。full が無ければ「全体を見る」導線ごと消えるため
  // 開いてファーストビューが出るだけという期待外れを避けられる（docs/works-capture.md 参照）。
  { slug: 'web-creation-service', ...MISSIONS,  out: 'full.png', fullPage: true },
  { slug: 'slider-patterns',      ...SLIDER,    out: 'full.png', fullPage: true },
  { slug: 'web-parts-reference',  url: 'https://web-parts-reference.netlify.app/', out: 'full.png', fullPage: true },
];
