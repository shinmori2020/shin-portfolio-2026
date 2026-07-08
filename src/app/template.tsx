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

  // View Transition 発動時は root のクロスフェード（globals.css / 180ms）が
  // ページ遷移を担うので、template 側の opacity フェードは抑制して二重発火を避ける。
  // TransitionLink が push 直前に data-vt を立てる → 新ページの template 再マウントが読む。
  const inViewTransition =
    typeof document !== "undefined" && document.documentElement.hasAttribute("data-vt");

  return (
    <motion.div
      initial={reduce || inViewTransition ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fade}
    >
      {children}
    </motion.div>
  );
}
