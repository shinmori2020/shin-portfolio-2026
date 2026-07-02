"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

type Props = {
  status: SubmitStatus;
  idleLabel?: string;
  className?: string;
};

// 180ms / easeOut がこのサイトの基準速度(ページ遷移と揃える)
const fade = { duration: 0.18, ease: "easeOut" } as const;
const drawCheck = { duration: 0.3, ease: "easeOut", delay: 0.05 } as const;

export function SubmitButton({ status, idleLabel = "送信する", className = "" }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="submit"
      disabled={status === "loading" || status === "success"}
      whileTap={reduce || status !== "idle" ? undefined : { scale: 0.98 }}
      aria-live="polite"
      data-status={status}
      className={`
        relative flex h-12 min-w-52 items-center justify-center
        rounded-full bg-accent text-sm font-medium tracking-wide
        text-white transition-colors duration-200
        hover:enabled:[background:color-mix(in_srgb,var(--accent)_88%,#000)]
        disabled:cursor-default
        data-[status=error]:bg-[#c0362c]
        ${className}
      `}
    >
      {/* mode="wait": 前のラベルが消えてから次が入る。
          initial={false}: 初回マウント時はアニメしない(LCP対策) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={fade}
          className="inline-flex items-center gap-2"
        >
          {status === "idle" && (
            <>
              {idleLabel}
              <ArrowIcon />
            </>
          )}
          {status === "loading" && (reduce ? "送信中…" : <Spinner />)}
          {status === "success" && (
            <>
              <CheckIcon animate={!reduce} />
              送信しました
            </>
          )}
          {status === "error" && "送信できませんでした"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ---------- 内部パーツ ---------- */

function Spinner() {
  return (
    <span
      role="status"
      aria-label="送信中"
      className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

// stroke-dashoffset ではなく Motion の pathLength を使うと
// パスの長さを手計算せずに済む
function CheckIcon({ animate }: { animate: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <motion.path
        d="M3 8.5 L6.5 12 L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={drawCheck}
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
