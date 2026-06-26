"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// アクセント語に、表示時スッと下線が引かれる演出（concept 強調用）。
export function Underlined({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative inline-block text-accent">
      {children}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute -bottom-[0.06em] left-0 right-0 h-[0.06em] origin-left rounded-full [background:color-mix(in_srgb,var(--accent)_55%,transparent)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-7%" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.3 }}
        />
      )}
    </span>
  );
}
