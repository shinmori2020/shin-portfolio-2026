"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

// 装飾の英語キーワード。表示時にタイプライターのように1文字ずつ打ち込まれ、末尾にカーソルが点滅する。
// reduced-motion 時は全文を即表示し、カーソルは出さない。
export function KeywordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-7%" });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, 75);
    return () => clearInterval(id);
  }, [inView, reduceMotion, text]);

  return (
    <span ref={ref} aria-hidden className={className}>
      {text.slice(0, count)}
      {/* 点滅カーソル（アクセント色の縦バー） */}
      <span className="ml-[0.06em] inline-block h-[0.82em] w-[2px] translate-y-[0.06em] bg-accent align-baseline animate-[caret-blink_1s_step-end_infinite] motion-reduce:hidden" />
    </span>
  );
}
