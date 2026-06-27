"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// 装飾の英語キーワード。表示時に左→右へワイプしながら現れる（reduced-motion時は静的）。
export function KeywordReveal({ text, className = "" }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <span aria-hidden className={`inline-block ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden
      className={`inline-block ${className}`}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0, x: 12 }}
      whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
    >
      {text}
    </motion.span>
  );
}
