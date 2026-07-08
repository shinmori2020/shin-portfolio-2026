"use client";

/**
 * next/link の薄いラッパー。View Transitions API 対応ブラウザ かつ
 * reduced-motion 無効時のみ、ナビゲーションを document.startViewTransition で包み
 * 共有要素（Worksスクリーンショット → 詳細ヒーロー）の連続変形を発動する。
 *
 * プログレッシブエンハンスメント（大前提）:
 *  - VT 非対応 / prefers-reduced-motion: reduce / 修飾キー・別タブ・外部URL・ハッシュ
 *    の場合は横取りせず、素の <Link> 挙動（＝template.tsx の 180ms フェード）に委ねる。
 *  - view-transition-name 自体はサーバHTMLに常に存在するが、発火するのはこの経路のみ。
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, type ComponentProps, type MouseEvent } from "react";
import { useViewTransitionFinishRef } from "./ViewTransitions";

type LinkProps = ComponentProps<typeof Link>;

// VT を発動してよい環境か。SSR安全 & reduced-motion 尊重（「弱める」ではなく「無くす」）。
function canRunViewTransition() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// 通常の左クリック（同一タブ・修飾キー無し）のみ横取り対象。
function isPlainLeftClick(e: MouseEvent<HTMLAnchorElement>, target?: string) {
  return (
    e.button === 0 &&
    !e.defaultPrevented &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey &&
    (!target || target === "_self")
  );
}

export const TransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(function TransitionLink(
  { href, onClick, ...props },
  ref,
) {
  const router = useRouter();
  const finishRef = useViewTransitionFinishRef();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);

      const url = typeof href === "string" ? href : href.toString();
      if (
        !finishRef ||
        !canRunViewTransition() ||
        !isPlainLeftClick(e, props.target) ||
        /^[a-z]+:\/\//i.test(url) || // 外部URL
        url.startsWith("#") // 同一ページ内アンカー
      ) {
        return; // 素の <Link>（フォールバック）に委ねる
      }

      e.preventDefault();
      // template.tsx にフェード抑制を伝える（root クロスフェードとの二重発火を防ぐ）。
      document.documentElement.setAttribute("data-vt", "");

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            finishRef.current = resolve; // pathname 変化（コミット）で解決される
            router.push(url);

            // 安全弁: 万一コミットを検知できなくても遷移を固まらせない。
            // 正常時はこれより先に上記 resolve が呼ばれる（morph は 320ms）。
            window.setTimeout(() => {
              if (finishRef.current === resolve) {
                finishRef.current = null;
                resolve();
              }
            }, 700);
          }),
      );

      const cleanup = () => document.documentElement.removeAttribute("data-vt");
      // finished は skip 時に reject し得るため resolve/reject 両方で後始末する。
      transition.finished.then(cleanup, cleanup);
    },
    [href, onClick, props.target, router, finishRef],
  );

  return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
});
