// 連番つきの本文セクション（左にラベル・右に内容の2カラム）。
// 作品詳細（01 概要 / 02 課題 …）と /tech で共用する。
//
// もとは works/[slug]/page.tsx にローカル定義していたものを、
// /tech でも同じ型を使うため切り出した。読み手が既に慣れた形なので迷わない。

import { Reveal } from "./Reveal";

export function NumberedSection({
  no,
  title,
  last = false,
  priority = false,
  children,
}: {
  no: string;
  title: React.ReactNode;
  /** 最後のセクションだけ下罫線を引く */
  last?: boolean;
  /** ファーストビューに入る場合に付ける（Reveal の priority と同義） */
  priority?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      priority={priority}
      className={`border-t border-line py-[clamp(36px,5vw,56px)] ${last ? "border-b" : ""}`}
    >
      <div className="grid gap-[clamp(16px,3vw,48px)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.08em] text-accent">{no}</span>
          <h2 className="m-0 text-[clamp(18px,2vw,23px)] font-semibold tracking-[-0.015em]">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </Reveal>
  );
}
