"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { Reveal } from "./Reveal";
import { KeywordReveal } from "./KeywordReveal";
import { Modal } from "./Modal";
import { ScrollTimeline } from "./ScrollTimeline";
import type { ProcessStep } from "@/data/process";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// スライド方向つきの切替アニメ（custom=方向）
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28, transition: { duration: 0.2, ease: EASE } }),
};

function PhaseContent({ p }: { p: ProcessStep }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[clamp(22px,4vw,30px)] font-medium text-accent">{p.no}</span>
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-faint">{p.en}</span>
      </div>

      <h2 id="process-modal-title" className="m-0 mt-4 text-[clamp(20px,3vw,26px)] font-medium tracking-[-0.02em]">
        {p.title}
      </h2>

      {/* 3行分の高さを確保し、フェーズごとに本文行数が違ってもモーダル高さを一定にする */}
      <p className="m-0 mt-4 min-h-[5.85em] text-[15px] leading-[1.95] text-muted">{p.detail.summary}</p>

      <p className="m-0 mt-7 text-[12px] tracking-[0.08em] text-faint">やること</p>
      <ul className="m-0 mt-3 flex list-none flex-col gap-[10px] p-0">
        {p.detail.does.map((d) => (
          <li key={d} className="flex items-start gap-[10px] text-[14px] leading-[1.7]">
            <span aria-hidden className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
            {d}
          </li>
        ))}
      </ul>

      <div className="mt-7 rounded-xl border border-line bg-surface-2 p-4">
        <p className="m-0 text-[12px] tracking-[0.08em] text-faint">成果物・納品物</p>
        <p className="m-0 mt-1 text-[14px] leading-[1.7]">{p.detail.output}</p>
      </div>
    </div>
  );
}

const navBtn =
  "grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-accent";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const reduceMotion = useReducedMotion();
  const open = active !== null;

  const go = useCallback(
    (delta: number) => {
      setDir(delta > 0 ? 1 : -1);
      setActive((prev) => (prev === null ? prev : (prev + delta + steps.length) % steps.length));
    },
    [steps.length],
  );

  // モーダル表示中は ← / → でフェーズを切り替え
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const current = active !== null ? steps[active] : null;

  return (
    <>
      <ScrollTimeline count={steps.length} className="m-0 list-none p-0">
        {(lit) => steps.map((p, i) => (
          <Reveal as="li" key={p.no} delayMs={p.delayMs} className="group flex gap-[clamp(16px,3vw,24px)]">
            <div className="flex flex-col items-center">
              <span
                data-tl-dot
                className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border font-mono text-[clamp(16px,1.8vw,19px)] transition-colors duration-200 ${
                  i < lit
                    ? "border-accent bg-accent text-bg"
                    : "border-line bg-surface text-accent group-hover:border-accent"
                }`}
              >
                {p.no}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setDir(1);
                setActive(i);
              }}
              aria-label={`${p.title} の詳細を見る`}
              className="flex flex-1 cursor-pointer flex-col gap-3 pt-[10px] pb-[clamp(28px,5vw,48px)] text-left md:flex-row md:items-center md:gap-[clamp(24px,4vw,48px)]"
            >
              <div className="md:basis-[70%] md:shrink-0">
                <h3 className="m-0 text-[clamp(18px,2.2vw,22px)] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="m-0 mt-2 text-[clamp(14px,1.6vw,16px)] leading-[1.85] text-muted">{p.desc}</p>
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
      </ScrollTimeline>

      <Modal open={open} onClose={() => setActive(null)} labelledById="process-modal-title">
        {current && active !== null && (
          <div>
            {/* 閉じる（静止）*/}
            <div className="flex justify-end">
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

            {/* フェーズ本体（スライド切替）*/}
            {reduceMotion ? (
              <PhaseContent p={current} />
            ) : (
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div key={active} custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                  <PhaseContent p={current} />
                </motion.div>
              </AnimatePresence>
            )}

            {/* 前へ / 位置 / 次へ */}
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => go(-1)} aria-label="前のフェーズ" className={navBtn}>
                <span aria-hidden>←</span>
              </button>
              <span className="font-mono text-[13px] tracking-[0.08em] text-faint">
                {active + 1} / {steps.length}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="次のフェーズ" className={navBtn}>
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
