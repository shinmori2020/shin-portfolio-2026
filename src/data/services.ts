// Services（頼めること）。
// 既定は「制作 / 開発」の2枚。下のピルを押すと、その分野の2枚に切り替わる。
// TOP では料金は表記しない方針。

/** カード/ピルに出すアイコンの種類 */
export type ServiceIconId = "site" | "code" | "ai" | "speed" | "quality" | "support";

export interface ServiceCard {
  icon: ServiceIconId;
  title: string;
  desc: string;
  /** 対応範囲の箇条書き */
  points: string[];
}

/** 切り替え対象の分野（ピル）。cards は必ず2枚。 */
export interface ServiceTopic {
  key: string;
  label: string;
  icon: ServiceIconId;
  cards: ServiceCard[];
}

// 既定：制作・開発の2本柱（＝「制作と開発のあいだをつなぐ」を体現）
export const defaultCards: ServiceCard[] = [
  {
    icon: "site",
    title: "制作の実務",
    desc: "WordPressサイトの保守や運用から新規構築まで。制作現場の進行や納品の事情まで理解しています。",
    points: [
      "既存サイトの改修・リニューアル",
      "公開後の更新や運用の代行",
      "制作会社との協業・一部受託",
    ],
  },
  {
    icon: "code",
    title: "モダンな開発",
    desc: "Next.jsなどで速くて壊れにくいサイトへ。制作で固めた見た目をそのまま動くかたちにします。",
    points: [
      "Next.js / TypeScript での実装",
      "速度とアクセシビリティを意識した設計",
      "コンポーネント設計と保守のしやすさ",
    ],
  },
];

// ピルで切り替わる分野（各2枚）
export const serviceTopics: ServiceTopic[] = [
  {
    key: "speed",
    label: "表示速度の改善",
    icon: "speed",
    cards: [
      {
        icon: "speed",
        title: "計測してボトルネックを特定",
        desc: "Core Web Vitals を計測し遅い原因を見つけます。",
        points: ["LCP / INP / CLS の計測", "重い画像やJSの洗い出し", "レンダリングの妨げの確認"],
      },
      {
        icon: "speed",
        title: "速い状態を保つ設計",
        desc: "画像・フォント・JS を最適化し体感速度を上げます。",
        points: ["next/image・next/font の活用", "不要なJSを増やさない設計", "公開後も速さを維持"],
      },
    ],
  },
  {
    key: "quality",
    label: "アクセシビリティ・SEO",
    icon: "quality",
    cards: [
      {
        icon: "quality",
        title: "誰でも使えるUI",
        desc: "キーボード操作やコントラストに配慮します。",
        points: ["フォーカスの可視化", "見出し階層とコントラスト", "キーボードだけで操作できる導線"],
      },
      {
        icon: "quality",
        title: "検索に強い土台",
        desc: "メタ情報や構造化で検索評価を整えます。",
        points: ["title / OGP などの整備", "構造化データの設定", "速度と中身の両面で対策"],
      },
    ],
  },
  {
    key: "support",
    label: "保守・運用",
    icon: "support",
    cards: [
      {
        icon: "support",
        title: "公開後の更新代行",
        desc: "文章や画像の差し替えなど日々の更新を引き受けます。",
        points: ["コンテンツの更新", "軽微な改修", "画像やバナーの差し替え"],
      },
      {
        icon: "support",
        title: "改善と不具合対応",
        desc: "公開後も様子を見ながら直していきます。",
        points: ["表示崩れや不具合の修正", "アクセス解析をもとにした改善", "継続的な改善提案"],
      },
    ],
  },
  {
    key: "ai",
    label: "AIの活用相談",
    icon: "ai",
    cards: [
      {
        icon: "ai",
        title: "使いどころの整理",
        desc: "取り入れるべきかどこに使えるかから一緒に考えます。",
        points: ["費用対効果の見極め", "向き不向きの整理", "運用コストの試算"],
      },
      {
        icon: "ai",
        title: "実装と人の線引き",
        desc: "AIに任せる所と人が判断する所を設計します。",
        points: ["RAG・チャットなどの実装", "どこは人が判断するかの設計", "品質は人が担保"],
      },
    ],
  },
];
