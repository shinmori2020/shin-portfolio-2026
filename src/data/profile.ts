// プロフィールページのデータ。文言は design-reference を踏襲しつつ
// サイト規約に合わせて調整（読点「、」不使用 / AIは相談ベースで控えめ / 対象を制作会社・事業者に広げる / 希少性アピールはしない）。

import type { ServiceIconId } from "@/data/services";

export const profile = {
  name: "シン",
  role: "Frontend Engineer / Web Developer",
  bio: "WordPress制作の実務から Next.js によるモダンフロント開発まで。制作と開発の両側を行き来できることを強みに 制作会社や事業者のパートナーとして「速くて・読みやすくて・壊れにくい」サイトを設計します。AIは目的に合う場面でのみ取り入れ 導入の是非からご相談いただけます。",
};

export interface SkillGroup {
  icon: ServiceIconId;
  cat: string;
  desc: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    icon: "code",
    cat: "Frontend",
    desc: "React / Next.js を中心に 型安全で保守しやすいフロントを設計します。",
    items: ["React / Next.js", "App Router", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    icon: "site",
    cat: "WordPress",
    desc: "制作現場で培ったテーマ開発から ヘッドレス構成への移行まで対応します。",
    items: ["テーマ開発・保守", "ヘッドレスWP", "カスタムフィールド設計", "既存資産の移行"],
  },
  {
    icon: "support",
    cat: "開発・運用",
    desc: "ホスティングや保守・運用 業務効率化など 周辺領域のご相談にも応じます。",
    items: ["Vercel ホスティング", "パフォーマンス最適化", "保守・運用", "業務効率化ツールの開発"],
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  desc: string;
  tags: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "2019–",
    title: "Web制作会社にて受託制作",
    desc: "WordPressを中心にコーポレートサイトやメディアサイトの制作と保守を幅広く担当しました。デザインの実装から公開後の更新運用まで一通り手がけ 制作現場の進行管理や納品のフローを体で覚えました。発注側とのやり取りやスケジュール調整など 実務の勘所をこの時期に身につけています。",
    tags: ["WordPress", "PHP", "HTML / CSS", "jQuery"],
  },
  {
    year: "2022–",
    title: "モダンフロントへ軸足を移す",
    desc: "React と Next.js での開発に本格的に取り組み 制作中心だった軸足をモダンフロントへ広げました。ヘッドレスWP構成やコンポーネント設計を通じて 表示速度と保守性を両立する作り方を追求しています。型安全なTypeScriptを前提に 長く運用しても壊れにくい土台づくりを意識するようになりました。",
    tags: ["React", "Next.js", "TypeScript", "ヘッドレスWP"],
  },
  {
    year: "2024–",
    title: "対応範囲を制作から開発まで広げる",
    desc: "受託で培った制作の知見にモダン開発を掛け合わせ 制作から開発まで一貫して引き受けられる体制を整えました。要件の整理から設計・実装・公開までを通して見通せるため 制作会社や事業者の継続パートナーとして境目で品質を落とさず進められます。必要に応じて表示速度や運用のしやすさまで踏み込んでご提案します。",
    tags: ["Next.js", "TypeScript", "パフォーマンス最適化"],
  },
  {
    year: "現在",
    title: "フリーランスとして活動",
    desc: "制作会社や事業者のパートナーとして 制作と開発の両方に幅広く対応する立場で参画しています。派手な演出より読みやすさと表示速度を重視し 発注側が安心して任せられる状態を技術でつくることを大切にしています。新しい技術も目的に合う場面で取り入れながら 長く付き合える品質を目指しています。",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
];
