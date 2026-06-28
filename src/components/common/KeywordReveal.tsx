"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// 装飾の英語キーワード。表示時に下から静かにフェードイン（サイト共通の reveal と同じトーン）。
export function KeywordReveal({ text, className = "" }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <span aria-hidden className={className}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
    >
      {text}
    </motion.span>
  );
}
