// Services（頼めること）= 2層構造。
// 主役：制作と開発の2本柱（＝「制作と開発のあいだをつなぐ」を体現）。
// 併記：そのほか対応できることを控えめに。TOP では料金は表記しない方針。

/** カード/ピルに出すアイコンの種類 */
export type ServiceIconId = "site" | "code" | "ai" | "speed" | "quality" | "support";

export interface Service {
  key: string;
  icon: ServiceIconId;
  title: string;
  desc: string;
  /** 対応範囲の箇条書き（説明補強） */
  points: string[];
  delayMs: number;
}

// 主役：2本柱
export const coreServices: Service[] = [
  {
    key: "A",
    icon: "site",
    title: "制作の実務",
    desc: "WordPressサイトの保守や運用から新規構築まで。制作現場の進行や納品の事情まで理解しています。",
    points: [
      "既存サイトの改修・リニューアル",
      "公開後の更新や運用の代行",
      "制作会社との協業・一部受託",
    ],
    delayMs: 0,
  },
  {
    key: "B",
    icon: "code",
    title: "モダンな開発",
    desc: "Next.jsなどで速くて壊れにくいサイトへ。制作で固めた見た目をそのまま動くかたちにします。",
    points: [
      "Next.js / TypeScript での実装",
      "速度とアクセシビリティを意識した設計",
      "コンポーネント設計と保守のしやすさ",
    ],
    delayMs: 90,
  },
];

// 併記：ほかにも対応できること
export interface OtherService {
  icon: ServiceIconId;
  label: string;
}

export const otherServices: OtherService[] = [
  { icon: "speed", label: "表示速度の改善" },
  { icon: "quality", label: "アクセシビリティ・SEO" },
  { icon: "support", label: "保守・運用" },
  { icon: "ai", label: "AIの活用相談" },
];
