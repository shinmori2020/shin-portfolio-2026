"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { KeywordReveal } from "./KeywordReveal";
import { Modal } from "./Modal";
import type { ProcessStep } from "@/data/process";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState<number | null>(null);
  const current = active !== null ? steps[active] : null;

  return (
    <>
      <ol className="relative m-0 list-none p-0">
        {steps.map((p, i) => (
          <Reveal
            as="li"
            key={p.no}
            delayMs={p.delayMs}
            className="group flex gap-[clamp(16px,3vw,24px)]"
          >
            {/* 番号バッジ＋つなぎの縦線 */}
            <div className="flex flex-col items-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-[clamp(16px,1.8vw,19px)] text-accent transition-colors duration-300 group-hover:border-accent">
                {p.no}
              </span>
              {i < steps.length - 1 && <span aria-hidden className="mt-2 w-px grow bg-line" />}
            </div>

            {/* 内容：クリックで詳細モーダル。左に本文（約70%）、右に薄い英語キーワード。 */}
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${p.title} の詳細を見る`}
              className="flex flex-1 cursor-pointer flex-col gap-3 pt-[10px] pb-[clamp(28px,5vw,48px)] text-left md:flex-row md:items-center md:gap-[clamp(24px,4vw,48px)]"
            >
              <div className="md:basis-[70%] md:shrink-0">
                <h3 className="m-0 text-[clamp(18px,2.2vw,22px)] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="m-0 mt-2 text-[clamp(14px,1.6vw,16px)] leading-[1.85] text-muted">
                  {p.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[12px] tracking-[0.04em] text-accent">
                  詳細を見る
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[3px]">
                    →
                  </span>
                </span>
              </div>
              <span className="hidden md:flex md:min-w-0 md:flex-1 md:justify-end">
                <KeywordReveal
                  text={p.en}
                  className="whitespace-nowrap font-mono text-[clamp(16px,2.2vw,26px)] uppercase tracking-[0.1em] [color:color-mix(in_srgb,var(--faint)_50%,transparent)]"
                />
              </span>
            </button>
          </Reveal>
        ))}
      </ol>

      <Modal open={active !== null} onClose={() => setActive(null)} labelledById="process-modal-title">
        {current && (
          <div>
            {/* ヘッダー：番号＋英語＋閉じる */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[clamp(22px,4vw,30px)] font-medium text-accent">{current.no}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-faint">{current.en}</span>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="閉じる"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-accent"
              >
                <span aria-hidden className="text-[16px] leading-none">
                  ×
                </span>
              </button>
            </div>

            <h2
              id="process-modal-title"
              className="m-0 mt-4 text-[clamp(20px,3vw,26px)] font-medium tracking-[-0.02em]"
            >
              {current.title}
            </h2>

            <p className="m-0 mt-4 text-[15px] leading-[1.95] text-muted">{current.detail.summary}</p>

            <p className="m-0 mt-7 text-[12px] tracking-[0.08em] text-faint">やること</p>
            <ul className="m-0 mt-3 flex list-none flex-col gap-[10px] p-0">
              {current.detail.does.map((d) => (
                <li key={d} className="flex items-start gap-[10px] text-[14px] leading-[1.7]">
                  <span aria-hidden className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-xl border border-line bg-surface-2 p-4">
              <p className="m-0 text-[12px] tracking-[0.08em] text-faint">成果物・納品物</p>
              <p className="m-0 mt-1 text-[14px] leading-[1.7]">{current.detail.output}</p>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex cursor-pointer items-center rounded-full border border-line-strong px-[22px] py-[11px] text-[14px] text-ink transition-colors duration-200 hover:border-accent"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
