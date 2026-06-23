// 制作物データ（design-reference の renderVals() から移植）。
// CMS を使わずここに型付きで直書きする。詳細ページ用のフィールドは後続ステップで拡張する。

export interface Work {
  /** 通し番号（表示用） */
  no: string;
  /** /works/[slug] のキー */
  slug: string;
  /** 作品名 */
  title: string;
  /** 一覧・ティーザー用の短い説明 */
  desc: string;
  /** ブラウザ風カードに表示する URL（現状はプレースホルダー） */
  url: string;
  /** 技術タグ */
  tags: string[];
  /** reveal アニメーションの遅延（ミリ秒, design-reference 準拠） */
  delayMs: number;
  /** スクリーンショット画像パス（未用意なら undefined → 斜線プレースホルダー） */
  image?: string;
}

export const works: Work[] = [
  {
    no: "01",
    slug: "headless-wp-media",
    title: "ヘッドレスWP構成のメディア＋コーポレートサイト",
    desc: "B2B SaaS企業向け。WordPressをCMSに、Next.jsでフロントを構築。",
    url: "saas-media.example.com",
    tags: ["Headless WP", "Next.js", "Tailwind"],
    delayMs: 0,
  },
  {
    no: "02",
    slug: "multilingual-ec",
    title: "多言語対応のECサイト",
    desc: "国・言語ごとの出し分けと、軽量な商品閲覧体験を実装。",
    url: "shop.example.com",
    tags: ["Next.js", "i18n", "Vercel"],
    delayMs: 80,
  },
  {
    no: "03",
    slug: "estimate-simulator",
    title: "コーディング見積もりシミュレーター",
    desc: "条件入力から概算を即時算出する、制作現場の業務効率化ツール。",
    url: "estimate.example.com",
    tags: ["React", "TypeScript", "Tool"],
    delayMs: 160,
  },
  {
    no: "04",
    slug: "proposal-builder",
    title: "Web制作提案書ビルダー",
    desc: "入力した内容からPDFを出力できる、提案業務の効率化ツール。",
    url: "proposal.example.com",
    tags: ["Next.js", "PDF", "Tool"],
    delayMs: 240,
  },
];
