// 制作の進め方（一般的な制作フローの仮テキスト。シンの実フローで差し替え可）。
// 継続委託の発注ハードルを下げる目的のセクション。

export interface ProcessStep {
  no: string;
  title: string;
  desc: string;
  delayMs: number;
}

export const processSteps: ProcessStep[] = [
  {
    no: "01",
    title: "ヒアリング・要件整理",
    desc: "目的・対象・制約を伺いゴールと進め方を一緒に整理します。",
    delayMs: 0,
  },
  {
    no: "02",
    title: "設計・お見積もり",
    desc: "構成と技術を設計しスコープ・進行・費用を明確にします。",
    delayMs: 80,
  },
  {
    no: "03",
    title: "実装・レビュー",
    desc: "速度とアクセシビリティを担保しつつ実装。こまめに共有し認識を合わせます。",
    delayMs: 160,
  },
  {
    no: "04",
    title: "納品・継続運用",
    desc: "公開後の改善・保守まで。継続的なパートナーとして伴走します。",
    delayMs: 240,
  },
];
