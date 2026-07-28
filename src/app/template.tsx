"use client";

/**
 * タスク1: ページ遷移のクロスフェード。
 * template はナビゲーションのたびに再マウントされるため 遷移ごとにフェードが発火する。
 * layout.tsx は変更しない。translateY は付けない（フェード単体が正）。
 */

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

// 180ms / easeOut = サイト全体のモーション基準値
const fade = { duration: 0.18, ease: "easeOut" } as const;

// 初回表示を通過したか。module スコープなので遷移で template が再マウントされても保持される。
// SSR とハイドレート直後は false のままなので サーバとクライアントの出力が一致する。
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  // View Transition 発動時は root のクロスフェード（globals.css / 180ms）が
  // ページ遷移を担うので、template 側の opacity フェードは抑制して二重発火を避ける。
  // TransitionLink が push 直前に data-vt を立てる → 新ページの template 再マウントが読む。
  const inViewTransition =
    typeof document !== "undefined" && document.documentElement.hasAttribute("data-vt");

  // 初回表示ではフェードしない。
  // initial={{opacity:0}} はサーバ出力のHTMLにも焼き込まれるため、そのままだと
  // ページ全体が透明のまま届き JS がハイドレートするまで何も描画されない。
  // 実測では LCP の Render Delay が本番で17.3秒に達していた。
  // クロスフェードは「前のページから次のページへ」の演出なので初回には不要。
  const skipFade = !navigated || reduce || inViewTransition;

  useEffect(() => {
    navigated = true;
  }, []);

  return (
    <motion.div
      initial={skipFade ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fade}
    >
      {children}
    </motion.div>
  );
}
