"use client";

/**
 * タスク4: ヘッダーのスクロール状態。
 * scrollY が threshold を超えたら true を返す。rAF スロットリング済み。
 */

import { useEffect, useState } from "react";

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > threshold);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update(); // 初期位置を反映（リロード時にページ途中の場合など）
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
