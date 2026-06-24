// できること（対応範囲）。TOP では料金は表記しない方針。
// 旧 Home の「3領域（What I do）」を Services として発展させたもの。

export interface Service {
  /** 記号ラベル（A/B/C） */
  key: string;
  title: string;
  desc: string;
  delayMs: number;
}

export const services: Service[] = [
  {
    key: "A",
    title: "WordPress制作の実務",
    desc: "既存サイトの保守から新規構築・移行まで。制作現場のリアルな進行・納品・運用に沿って動けます。",
    delayMs: 0,
  },
  {
    key: "B",
    title: "モダンフロント開発",
    desc: "Next.js (App Router) / TypeScript / Tailwind / Framer Motion / Vercel。速くて壊れにくい実装を設計・構築します。",
    delayMs: 90,
  },
  {
    key: "C",
    title: "AIを使った実装",
    desc: "RAG・エージェント・AIコーディングの実践経験。どこに使い、どこは人が判断するかを設計します。",
    delayMs: 180,
  },
];
