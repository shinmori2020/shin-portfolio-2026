"use client";

/**
 * タスク1: ページ遷移のクロスフェード。
 * template はナビゲーションのたびに再マウントされるため 遷移ごとにフェードが発火する。
 * layout.tsx は変更しない。translateY は付けない（フェード単体が正）。
 */

import { motion, useReducedMotion } from "motion/react";

// 180ms / easeOut = サイト全体のモーション基準値
const fade = { duration: 0.18, ease: "easeOut" } as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fade}
    >
      {children}
    </motion.div>
  );
}
