"use client";

/**
 * View Transitions（共有要素遷移）の司令塔。
 *
 * App Router の router.push は非同期でDOMを更新するため、
 * document.startViewTransition のコールバックが返す Promise を
 * 「新ルートがコミットされた瞬間」まで保留し、その時点で解決する必要がある。
 * その解決関数(finishRef)をここで保持し、usePathname の変化＝コミット完了を
 * トリガーに解決する。TransitionLink からは useViewTransitionFinishRef() で参照する。
 *
 * レイアウト直下に常駐させる（遷移で unmount されない位置）ことが前提。
 */

import { createContext, useContext, useEffect, useRef, type MutableRefObject } from "react";
import { usePathname } from "next/navigation";

type FinishFn = () => void;

const ViewTransitionCtx = createContext<MutableRefObject<FinishFn | null> | null>(null);

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const finishRef = useRef<FinishFn | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 新ルートのDOMがコミットされた（pathname が変わった）タイミングで、
    // 保留中のトランジションを解決 → ブラウザが新スナップショットを取得する。
    if (finishRef.current) {
      finishRef.current();
      finishRef.current = null;
    }
  }, [pathname]);

  return <ViewTransitionCtx.Provider value={finishRef}>{children}</ViewTransitionCtx.Provider>;
}

/** TransitionLink が保留トランジションの解決関数を差し込むための ref を返す。 */
export function useViewTransitionFinishRef() {
  return useContext(ViewTransitionCtx);
}
