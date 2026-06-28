"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// 装飾の英語キーワード。表示時にぼかし＋フェードから、ゆっくりピントが合うように現れる（blur-in）。
// reduced-motion 時は静的表示。
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
      initial={{ opacity: 0, filter: "blur(9px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
    >
      {text}
    </motion.span>
  );
}
