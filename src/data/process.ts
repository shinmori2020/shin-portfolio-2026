// 制作の進め方（一般的な制作フローの仮テキスト。シンの実フローで差し替え可）。
// 継続委託の発注ハードルを下げる目的のセクション。

export interface ProcessStep {
  no: string;
  /** 右側に薄く置く英語キーワード（フェーズ名）*/
  en: string;
  title: string;
  desc: string;
  delayMs: number;
}

export const processSteps: ProcessStep[] = [
  {
    no: "01",
    en: "Hearing",
    title: "ヒアリング・ご相談",
    desc: "やりたいことや今ある困りごとをじっくりお聞きします。目的や予算感をふまえて全体の方向性を一緒に決めます。",
    delayMs: 0,
  },
  {
    no: "02",
    en: "Requirements",
    title: "要件整理・ゴール設定",
    desc: "必要なページや機能を洗い出して優先順位をつけます。何を達成できれば成功かをはっきりさせます。",
    delayMs: 80,
  },
  {
    no: "03",
    en: "Proposal",
    title: "設計・お見積もり",
    desc: "構成と使う技術を設計します。スコープと進行と費用を明確にしてからお見積もりを出します。",
    delayMs: 160,
  },
  {
    no: "04",
    en: "Develop",
    title: "デザイン・実装",
    desc: "デザインの意図を保ったまま実装します。速くて壊れにくい作りを意識して組み立てます。",
    delayMs: 240,
  },
  {
    no: "05",
    en: "Review",
    title: "テスト・レビュー",
    desc: "表示崩れや動作を端末ごとに確認します。アクセシビリティや表示速度もチェックして仕上げます。",
    delayMs: 320,
  },
  {
    no: "06",
    en: "Launch",
    title: "公開・継続運用",
    desc: "本番へ公開して納品します。公開後の更新や改善も継続的に引き受けます。",
    delayMs: 400,
  },
];
