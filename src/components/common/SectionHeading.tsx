// セクション見出し（ラベルを上・短い罫線・タイトルを下に縦積み）。
// Home / Profile / tech で共用する。もとは各ページに同一のものが重複定義されていた。
//
// この型はサイトの標準レイアウトで、見出しの下に内容を全幅で置く。
// 左に見出し・右に内容の2カラム（NumberedSection）は内容が短い前提の型なので
// 長文が続くページではこちらを使う（左が縦に間延びしないため）。

import { DrawLine } from "./DrawLine";

/** ラベル単体（見出しを伴わず section の頭に置く場合に使う） */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[12px] tracking-[0.1em] text-faint">{children}</span>;
}

export function SectionHeading({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <DrawLine className="mt-[14px] w-10" />
      <h2 className="mt-[14px] text-[clamp(22px,3vw,34px)] font-medium leading-[1.4] tracking-[-0.02em]">
        {children}
      </h2>
    </div>
  );
}
