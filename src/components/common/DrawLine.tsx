"use client";

import { motion, useReducedMotion } from "motion/react";

// セクション見出し用の細い罫線。スクロールで左→右に「描かれる」。
export function DrawLine({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span aria-hidden className={`block h-px bg-line-strong ${className}`} />;
  }

  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-line-strong ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
    />
  );
}
