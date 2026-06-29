"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * 見出しを 1 文字ずつ下からフェードインさせる。
 * phrases は折り返し単位（PC では inline で 1 行、狭い画面では block で改行）。
 * stagger は phrases をまたいで連続する。
 * 最後の文字が出始める時刻（秒）は startDelay + (総文字数 - 1) * charDelay。
 * reduced-motion 時は静的表示。
 */
export function HeadingChars({
  phrases,
  className = "",
  charDelay = 0.04,
  startDelay = 0.05,
  duration = 0.5,
}: {
  phrases: string[];
  className?: string;
  charDelay?: number;
  startDelay?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const full = phrases.join("");

  if (reduce) {
    return (
      <span className={className}>
        {phrases.map((p, i) => (
          <span key={i} className="block sm:inline">
            {p}
          </span>
        ))}
      </span>
    );
  }

  let idx = 0;
  return (
    <span className={className} aria-label={full}>
      {phrases.map((phrase, pi) => (
        <span key={pi} aria-hidden className="block sm:inline">
          {Array.from(phrase).map((ch, ci) => {
            const delay = startDelay + idx * charDelay;
            idx += 1;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, y: "0.45em" }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-7%" }}
                transition={{ duration, ease: EASE, delay }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
