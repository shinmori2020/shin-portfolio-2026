// プロフィールページのデータ。文言は design-reference を踏襲しつつ
// サイト規約に合わせて調整（読点「、」不使用 / AIは相談ベースで控えめ / 対象を制作会社・事業者に広げる / 希少性アピールはしない）。

export const profile = {
  name: "シン",
  role: "Frontend Engineer / Web Developer",
  bio: "WordPress制作の実務から Next.js によるモダンフロント開発まで。制作と開発の両側を行き来できることを強みに 制作会社や事業者のパートナーとして「速くて・読みやすくて・壊れにくい」サイトを設計します。AIを活用した実装のご相談にも対応します。",
};

export interface SkillGroup {
  cat: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    cat: "Frontend",
    items: ["React / Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    cat: "WordPress",
    items: ["テーマ開発・保守", "ヘッドレスWP構成", "カスタムフィールド設計", "既存資産の移行"],
  },
  {
    cat: "AI / その他",
    items: ["AIを活用した実装の相談", "AIコーディングの活用", "Vercel ホスティング", "業務効率化ツールの開発"],
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  desc: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2019–",
    title: "Web制作会社にて受託制作",
    desc: "WordPressを中心としたコーポレート・メディアサイトの制作と保守を担当。制作現場の進行と納品を経験。",
  },
  {
    year: "2022–",
    title: "モダンフロントへ軸足を移す",
    desc: "React / Next.js での開発に本格的に取り組む。ヘッドレスWP構成などの設計・実装を担うように。",
  },
  {
    year: "2024–",
    title: "AI活用を実務に取り入れる",
    desc: "AIコーディングやRAGなどを必要に応じて実案件に導入。「使う/任せる」の線引きを見極めて設計に落とし込む。",
  },
  {
    year: "現在",
    title: "フリーランスとして活動",
    desc: "制作会社や事業者のパートナーとして 制作と開発の両方に幅広く対応する立場で参画。",
  },
];
