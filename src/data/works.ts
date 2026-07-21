// 制作物データ（design-reference の renderVals() から移植）。
// CMS を使わずここに型付きで直書きする。
// 詳細ページの本文（概要・課題・技術スタック・工夫点）は仮テキスト。実案件に合わせて差し替える。
// 文体: 読点「、」なし / 「。」を細切れに連発しない。スクリーンショット画像は後日差し替え。

export interface WorkMeta {
  client: string;
  role: string;
  year: string;
  type: string;
}

export interface Problem {
  k: string;
  v: string;
}

export interface StackItem {
  cat: string;
  name: string;
}

export interface CraftItem {
  t: string;
  d: string;
}

export interface Outcome {
  /** 指標名（例: 表示速度 LCP・モバイル実測） */
  label: string;
  /** 改善前の値（例: 2.8s）。定性成果では省略 */
  before?: string;
  /** 改善後・実測値（例: 0.9s）。before なしで単独指定なら単値表示 */
  after?: string;
  /** 補足（任意） */
  note?: string;
}

export interface Work {
  /** 通し番号（表示用） */
  no: string;
  /** /works/[slug] のキー */
  slug: string;
  /** 種別ラベル（一覧カード・詳細ヘッダー） */
  kind: string;
  /** 作品名 */
  title: string;
  /** 一覧・ティーザー用の短い説明 */
  desc: string;
  /** ブラウザ風カードに表示する URL 表記（スキームなしのドメイン+任意パス） */
  url: string;
  /** 公開サイトへの外部リンク先（完全URL）。未設定なら「サイトを見る」導線を出さない */
  href?: string;
  /** 技術タグ */
  tags: string[];
  /** reveal アニメーションの遅延（ミリ秒, design-reference 準拠） */
  delayMs: number;
  /** スクリーンショット画像パス（未用意なら undefined → 斜線プレースホルダー） */
  image?: string;
  /** 全体スクリーンショット（縦長・モーダル表示用。未指定なら image を使用） */
  imageFull?: string;
  /** 詳細ページのメタ情報 */
  meta: WorkMeta;
  /** 詳細: 制作物の概要 */
  overview: string;
  /** 詳細: 解決した課題 */
  problems: Problem[];
  /** 詳細: 使用技術スタック */
  stack: StackItem[];
  /** 詳細: 工夫した点・こだわり */
  craft: CraftItem[];
  /** 詳細: 成果（未入力なら 05 セクションごと非表示） */
  outcomes?: Outcome[];
}

export const works: Work[] = [
  {
    no: "01",
    slug: "headless-wp-media",
    kind: "Headless WordPress",
    title: "ヘッドレスWP構成のメディア＋コーポレートサイト",
    desc: "B2B SaaS企業向け。WordPressをCMSに使いNext.jsでフロントを構築。",
    url: "nordic-works.vercel.app",
    href: "https://nordic-works.vercel.app/",
    tags: ["Headless WP", "Next.js", "Tailwind"],
    delayMs: 0,
    meta: { client: "B2B SaaS 企業", role: "設計・フロント実装", year: "2026", type: "受託 / 継続" },
    overview:
      "SaaSを提供するB2B企業のオウンドメディアとコーポレートサイトを統合的に再構築しました。記事更新は従来どおりWordPressの管理画面で行いながら表示側をNext.jsに切り替えるヘッドレス構成です。編集者の運用を変えずに表示速度とSEOと拡張性を引き上げました。",
    problems: [
      { k: "P1", v: "記事更新はWordPressのまま続けたい一方で表示速度とSEOを改善したいという運用と性能のトレードオフがありました。" },
      { k: "P2", v: "コーポレートとメディアでサイトが分かれておりデザインと導線がちぐはぐでした。" },
      { k: "P3", v: "機能追加のたびにテーマが肥大化し改修コストが上がり続けていました。" },
    ],
    stack: [
      { cat: "Framework", name: "Next.js (App Router)" },
      { cat: "Styling", name: "Tailwind CSS" },
      { cat: "Motion", name: "Framer Motion" },
      { cat: "CMS", name: "WordPress (Headless)" },
      { cat: "Hosting", name: "Vercel" },
      { cat: "Language", name: "TypeScript" },
    ],
    craft: [
      { t: "編集者の運用を変えない", d: "管理画面や入稿フローやプレビューの体験を従来どおりに保ち移行のストレスをなくしました。" },
      { t: "上品なモーションを速度を犠牲にせず", d: "フェードと控えめな浮き上がりだけを使い初期表示と体感速度を最優先に調整しました。" },
      { t: "拡張しても壊れない情報設計", d: "コンポーネントとデータ取得を分離し機能追加が局所的な変更で済む構造にしました。" },
    ],
    // 成果(05) 記入例。実データが入ったら下の outcomes を有効化する（未入力の案件はセクションごと非表示）。
    // 書き方: 数値改善は before→after / 単発の実測値は after のみ / 定性成果は label+note。
    // outcomes: [
    //   { label: "表示速度 LCP（モバイル実測）", before: "2.8s", after: "0.9s" },
    //   { label: "Lighthouse", after: "Performance 98 / Accessibility 100 / SEO 100" },
    //   { label: "記事更新の運用", note: "編集フローを変えずにヘッドレス化し表示速度とSEOを改善" },
    // ],
  },
  {
    no: "02",
    slug: "multilingual-ec",
    kind: "E-Commerce / i18n",
    title: "多言語対応のECサイト",
    desc: "国・言語ごとの出し分けと軽量な商品閲覧体験を実装。",
    url: "stillne-shop.vercel.app/ja",
    href: "https://stillne-shop.vercel.app/ja",
    tags: ["Next.js", "i18n", "Vercel"],
    delayMs: 80,
    meta: { client: "アパレルEC事業者", role: "設計・フロント実装", year: "2026", type: "受託" },
    overview:
      "国と言語ごとにコンテンツを出し分ける多言語ECサイトを構築しました。軽快な商品閲覧体験とルーティングや文言管理のしやすさを両立させています。",
    problems: [
      { k: "P1", v: "言語ごとの出し分けと商品ページの表示速度を同時に満たす必要がありました。" },
      { k: "P2", v: "文言や翻訳の管理が属人化し更新のたびに手間がかかっていました。" },
      { k: "P3", v: "URL設計が複雑で検索エンジンに正しく評価されにくい状態でした。" },
    ],
    stack: [
      { cat: "Framework", name: "Next.js (App Router)" },
      { cat: "i18n", name: "next-intl" },
      { cat: "Styling", name: "Tailwind CSS" },
      { cat: "Language", name: "TypeScript" },
      { cat: "Hosting", name: "Vercel" },
    ],
    craft: [
      { t: "翻訳を一箇所で管理する", d: "文言を型付きで一元管理し追加や修正を安全に反映できるようにしました。" },
      { t: "言語ごとのURLを整理する", d: "検索エンジンにも利用者にも分かりやすいルーティングに整えました。" },
      { t: "画像と読み込みを軽く保つ", d: "商品画像の最適化と遅延読み込みで一覧の表示を軽快にしました。" },
    ],
  },
  {
    no: "03",
    slug: "estimate-simulator",
    kind: "Internal Tool",
    title: "コーディング見積もりシミュレーター",
    desc: "条件入力から概算を即時算出する制作現場の業務効率化ツール。",
    url: "mitsumo-project.vercel.app",
    href: "https://mitsumo-project.vercel.app/",
    tags: ["React", "TypeScript", "Tool"],
    delayMs: 160,
    meta: { client: "自社 / 制作会社向け", role: "企画・設計・実装", year: "2026", type: "社内ツール" },
    overview:
      "条件を入力すると概算金額を即時に算出する見積もりシミュレーターです。制作現場の見積もり業務にかかる手間と属人化を減らすために作りました。",
    problems: [
      { k: "P1", v: "見積もりが担当者ごとにばらつき算出に時間がかかっていました。" },
      { k: "P2", v: "条件の抜け漏れが起きやすく後から金額が変わることがありました。" },
      { k: "P3", v: "過去の見積もり基準が共有されず再利用しにくい状態でした。" },
    ],
    stack: [
      { cat: "Framework", name: "React" },
      { cat: "Language", name: "TypeScript" },
      { cat: "Styling", name: "Tailwind CSS" },
      { cat: "Hosting", name: "Vercel" },
    ],
    craft: [
      { t: "入力から即時に算出する", d: "条件を選ぶだけで概算がその場で出るようにし確認の往復を減らしました。" },
      { t: "基準を一箇所にまとめる", d: "単価や係数を設定として切り出し更新を安全にしました。" },
      { t: "誰でも迷わない画面に", d: "項目を絞り入力の順序を整理して迷わず使える導線にしました。" },
    ],
  },
  {
    no: "04",
    slug: "proposal-builder",
    kind: "Internal Tool / PDF",
    title: "Web制作提案書ビルダー",
    desc: "入力した内容からPDFを出力できる提案業務の効率化ツール。",
    url: "proposal-builder-flame.vercel.app",
    href: "https://proposal-builder-flame.vercel.app/",
    tags: ["Next.js", "PDF", "Tool"],
    delayMs: 240,
    meta: { client: "自社 / 制作会社向け", role: "企画・設計・実装", year: "2026", type: "社内ツール" },
    overview:
      "入力した内容から体裁の整った提案書PDFを出力できるツールです。提案業務にかかる時間を大きく短縮するために作りました。",
    problems: [
      { k: "P1", v: "提案書の作成に毎回時間がかかり体裁も揃いませんでした。" },
      { k: "P2", v: "テンプレートが個人ごとに分かれ品質にばらつきがありました。" },
      { k: "P3", v: "内容の差し替えや再出力の手間が大きい状態でした。" },
    ],
    stack: [
      { cat: "Framework", name: "Next.js" },
      { cat: "PDF", name: "react-pdf" },
      { cat: "Language", name: "TypeScript" },
      { cat: "Styling", name: "Tailwind CSS" },
      { cat: "Hosting", name: "Vercel" },
    ],
    craft: [
      { t: "入力から整った体裁で出力", d: "内容を入れるだけで統一されたレイアウトのPDFを生成します。" },
      { t: "テンプレートを共通化する", d: "体裁を一つの基準にまとめ品質のばらつきをなくしました。" },
      { t: "差し替えと再出力を簡単に", d: "項目の編集だけで何度でも作り直せるようにしました。" },
    ],
  },
];

/** slug から作品を取得（詳細ページ用） */
export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}
