"use client";

/**
 * ヒーロー背景「木漏れ日 × 組版方眼」。
 * ヒーロー section の最初の子として配置する（section 側に relative と overflow-hidden・
 * コンテンツ側に relative z-10 が必要）。スタイルは globals.css の .hero-backdrop 系とペア。
 * 振り付けは requestIdleCallback 後の data-armed で開始（LCP を遅らせない）。
 */

import { useEffect, useRef } from "react";

/** 時刻→パレット判定。UIには出さない隠し要素 */
function timeSlot(hour: number): "asa" | "hiru" | "yu" | "yoru" {
  if (hour >= 5 && hour < 10) return "asa";
  if (hour >= 10 && hour < 16) return "hiru";
  if (hour >= 16 && hour < 19) return "yu";
  return "yoru";
}

// コンテンツ左端（section の px パディング）に合わせた縦罫の左位置
const CONTENT_LEFT = "clamp(20px,4vw,40px)";

/* 方眼の構成。mdHide: true はモバイル(768px以下)で間引く */
const H_LINES = [
  { top: "18%", d: ".08s" },
  { top: "34%", d: ".16s", mdHide: true },
  { top: "50%", d: ".24s" },
  { top: "66%", d: ".32s", mdHide: true },
  { top: "82%", d: ".40s" },
];
const V_LINES = [
  { left: CONTENT_LEFT, d: ".45s" }, // コンテンツ左端に揃える
  { left: "62%", d: ".55s", mdHide: true },
];
const TOMBO = [
  { left: CONTENT_LEFT, top: "34%", d: "1.15s" },
  { left: "62%", top: "18%", d: "1.25s" },
  { left: "62%", top: "66%", d: "1.35s" },
];

export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 時刻パレット: hydration不整合を避けるためマウント後に付与
    el.dataset.time = timeSlot(new Date().getHours());

    // 振り付けの発火: LCP(見出し)を邪魔しないようアイドル後に data-armed
    const arm = () => el.setAttribute("data-armed", "");
    const hasRIC = typeof window.requestIdleCallback === "function";
    const idleId: number = hasRIC
      ? window.requestIdleCallback(arm, { timeout: 800 })
      : window.setTimeout(arm, 300);

    // 気配の視差: 光レイヤーだけが遅れて応答。遅れは CSS transition(1.4s) に任せる。
    const hero = el.parentElement;
    const lights = el.querySelector<HTMLElement>("[data-lights]");

    const onMove = (e: MouseEvent) => {
      if (!hero || !lights) return;
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      lights.style.transform = `translate(${nx * 26}px, ${ny * 14}px)`;
    };
    const onLeave = () => {
      if (lights) lights.style.transform = "translate(0, 0)";
    };

    hero?.addEventListener("mousemove", onMove);
    hero?.addEventListener("mouseleave", onLeave);

    return () => {
      if (hasRIC) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      hero?.removeEventListener("mousemove", onMove);
      hero?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hero-backdrop" aria-hidden="true">
      {/* 光レイヤー(木漏れ日) */}
      <div className="hb-lights" data-lights>
        <span className="hb-lt hb-l1" />
        <span className="hb-lt hb-l2" />
        <span className="hb-lt hb-l3" />
      </div>

      {/* 方眼レイヤー: 背景は全幅だが、方眼だけは中央1180pxのラッパでコンテンツ列に整列 */}
      <div className="hb-gridwrap">
        <div className="hb-grid">
          {H_LINES.map((l, i) => (
          <span
            key={`h${i}`}
            className={`hb-gh${l.mdHide ? " hb-md" : ""}`}
            style={{ top: l.top, "--d": l.d } as React.CSSProperties}
          />
        ))}
        {V_LINES.map((l, i) => (
          <span
            key={`v${i}`}
            className={`hb-gv${l.mdHide ? " hb-md" : ""}`}
            style={{ left: l.left, "--d": l.d } as React.CSSProperties}
          />
        ))}
        {TOMBO.map((t, i) => (
          <span
            key={`t${i}`}
            className="hb-tb"
            style={{ left: t.left, top: t.top, "--d": t.d } as React.CSSProperties}
          />
        ))}
        </div>
      </div>
    </div>
  );
}
