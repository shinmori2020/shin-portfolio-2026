"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * 縦タイムラインのスクロール描画。
 * - 下地の縦罫線に「進捗線」を重ね スクロール進捗に応じて scaleY(0→1) で伸ばす
 * - 進捗線の先端が各点を通過した瞬間 その点を灯す（前進のみ／逆スクロールで消えない）
 * - reduced-motion では完成形（scaleY(1) 全点灯）で静止（globals.css の .tl-rail でも担保）
 *
 * 既存マークアップへは render-prop で適合させる。呼び出し側は点（●）に
 * `data-tl-dot` を付け 灯り状態は children(lit) で受け取った lit（点灯済みの数）で描く。
 * レールの位置（x / 上下端）は data-tl-dot の実測から求めるため 寸法指定は不要。
 */
export function ScrollTimeline({
  count,
  className,
  children,
}: {
  /** 点（●）の総数 */
  count: number;
  className?: string;
  /** lit = 先頭から数えて点灯済みの点の数 */
  children: (lit: number) => ReactNode;
}) {
  const { ref, progress } = useScrollProgress<HTMLOListElement>();
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(0);
  const [rail, setRail] = useState<{ top: number; height: number; left: number } | null>(null);

  // 進捗 → 点灯数（前進のみ）。先端が点の中心に達したら灯る想定で floor(p*count + 0.5)。
  useEffect(() => {
    if (reduce) {
      setLit(count);
      return;
    }
    const next = Math.min(count, Math.floor(progress * count + 0.5));
    setLit((c) => Math.max(c, next));
  }, [progress, count, reduce]);

  // レールを先頭ノード中心〜末尾ノード中心に合わせる。
  // Reveal が各項目に transform を当てるため offsetParent が <li> 側になり得る。
  // 単純な offsetTop では基準がズレて高さ0になるので ol までを親方向に積算する。
  // offsetTop/Left は transform 非依存なので reveal 中でも安定。計測はレイアウト時のみ（スクロール毎ではない）。
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const offsetWithin = (node: HTMLElement) => {
      let top = 0;
      let left = 0;
      let cur: HTMLElement | null = node;
      while (cur && cur !== el && el.contains(cur)) {
        top += cur.offsetTop;
        left += cur.offsetLeft;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return { top, left };
    };
    const measure = () => {
      const dots = el.querySelectorAll<HTMLElement>("[data-tl-dot]");
      if (dots.length < 2) {
        setRail(null);
        return;
      }
      const first = dots[0];
      const last = dots[dots.length - 1];
      const f = offsetWithin(first);
      const l = offsetWithin(last);
      const top = f.top + first.offsetHeight / 2;
      const bottom = l.top + last.offsetHeight / 2;
      const left = f.left + first.offsetWidth / 2;
      setRail({ top, height: bottom - top, left });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [ref, count]);

  // 進捗が変わるたびに全項目を再レンダしないよう lit をキーにメモ化（INP 対策）。
  const items = useMemo(() => children(lit), [children, lit]);

  const p = reduce ? 1 : progress;

  return (
    <ol ref={ref} className={`relative ${className ?? ""}`}>
      {rail && (
        <>
          {/* 下地の線（点の背後に隠れ 隙間だけ見える） */}
          <span
            aria-hidden
            className="pointer-events-none absolute w-px bg-line"
            style={{ left: rail.left, top: rail.top, height: rail.height }}
          />
          {/* 進捗線：scaleY のみで伸ばす（リフローなし） */}
          <span
            aria-hidden
            className="tl-rail pointer-events-none absolute w-px origin-top bg-accent will-change-transform"
            style={{ left: rail.left, top: rail.top, height: rail.height, transform: `scaleY(${p})` }}
          />
        </>
      )}
      {items}
    </ol>
  );
}
