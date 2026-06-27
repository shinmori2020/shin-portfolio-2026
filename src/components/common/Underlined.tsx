"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// 文字を1文字ずつフェードインさせるための variants
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const charVariants: Variants = {
  hidden: { opacity: 0, y: "0.35em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const underlineClass =
  "absolute -bottom-[0.06em] left-0 right-0 h-[0.06em] origin-left rounded-full [background:color-mix(in_srgb,var(--accent)_55%,transparent)]";

// アクセント語。表示時に1文字ずつフェードインし、最後に下線がスッと引かれる。
export function Underlined({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const chars = typeof children === "string" ? Array.from(children) : null;

  // reduced-motion または文字列以外はアニメなしで表示
  if (reduceMotion || !chars) {
    return (
      <span className="relative inline-block text-accent">
        {children}
        {!reduceMotion && (
          <motion.span
            aria-hidden
            className={underlineClass}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-7%" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          />
        )}
      </span>
    );
  }

  return (
    <span className="relative inline-block text-accent">
      <motion.span
        aria-label={children as string}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-7%" }}
      >
        {chars.map((c, i) => (
          <motion.span key={i} aria-hidden variants={charVariants} className="inline-block">
            {c}
          </motion.span>
        ))}
      </motion.span>
      {/* 文字が出そろったあとに下線を引く */}
      <motion.span
        aria-hidden
        className={underlineClass}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-7%" }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
      />
    </span>
  );
}
