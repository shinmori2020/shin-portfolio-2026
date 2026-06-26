// できること（対応範囲）。TOP では料金は表記しない方針。
// 旧 Home の「3領域（What I do）」を Services として発展させたもの。

/** カード上部に出すアイコンの種類 */
export type ServiceIconId = "site" | "code" | "ai" | "speed" | "quality" | "support";

export interface Service {
  /** 記号ラベル（A/B/C…） */
  key: string;
  /** 上部アイコン */
  icon: ServiceIconId;
  title: string;
  desc: string;
  delayMs: number;
}

export const services: Service[] = [
  {
    key: "A",
    icon: "site",
    title: "WordPress制作の実務",
    desc: "既存サイトの保守から新規構築・移行まで。制作現場のリアルな進行・納品・運用に沿って動けます。",
    delayMs: 0,
  },
  {
    key: "B",
    icon: "code",
    title: "モダンフロント開発",
    desc: "Next.js (App Router) / TypeScript / Tailwind / Framer Motion / Vercel。速くて壊れにくい実装を設計・構築します。",
    delayMs: 90,
  },
  {
    key: "C",
    icon: "ai",
    title: "AIを活用した実装",
    desc: "ご希望に応じてRAG・チャットなどAIを使った機能の実装もご相談いただけます。どこで使いどこは人が判断するかまで設計します。",
    delayMs: 180,
  },
  {
    key: "D",
    icon: "speed",
    title: "表示速度・パフォーマンス改善",
    desc: "Core Web Vitals を意識して画像・フォント・JS を最適化。体感速度と検索評価を引き上げます。",
    delayMs: 0,
  },
  {
    key: "E",
    icon: "quality",
    title: "アクセシビリティ・SEO対応",
    desc: "キーボード操作・コントラスト・見出し階層・メタ情報まで。検索とユーザー双方に配慮します。",
    delayMs: 90,
  },
  {
    key: "F",
    icon: "support",
    title: "保守・運用サポート",
    desc: "公開後の更新・改善・不具合対応まで。継続的なパートナーとして伴走します。",
    delayMs: 180,
  },
];
