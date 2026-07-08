"use client";

/**
 * useScrollProgress
 * 対象要素がビューポートを通過する進捗を 0〜1 で返す。
 * - start: 要素上端がビューポート高の何%位置に来たら 0 とするか（既定 0.85）
 * - end:   要素下端がビューポート高の何%位置に来たら 1 とするか（既定 0.40）
 * - rAF スロットリング + passive リスナー（実務の基本形）
 * - タイムライン用途では「前進のみ」の点灯判定を呼び出し側で行う
 *   （例: passed = Math.max(passed, progress)）
 */

import { useEffect, useRef, useState } from "react";

export function useScrollProgress<T extends HTMLElement>(start = 0.85, end = 0.4) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start; // 進捗0の基準線
      const to = vh * end; // 進捗1の基準線
      const total = r.height + (from - to);
      const passed = from - r.top;
      const p = Math.min(Math.max(passed / total, 0), 1);
      setProgress(p);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update(); // 初期位置（ページ中腹リロード等）を反映
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [start, end]);

  return { ref, progress };
}
