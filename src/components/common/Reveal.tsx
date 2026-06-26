"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useMemo, type ElementType, type ReactNode } from "react";

// よく使うタグだけ事前にマップ（render ごとに motion.create で新しい型を作らない）
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  a: motion.a,
  ul: motion.ul,
  li: motion.li,
} as const;

type MotionTag = keyof typeof MOTION_TAGS;

// 出現方向（初期オフセット）
const INITIAL = {
  up: { opacity: 0, y: 20 },
  left: { opacity: 0, x: -28 },
  right: { opacity: 0, x: 28 },
} as const;

interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  /** data-reveal-delay 相当（ミリ秒）。design-reference の値をそのまま渡す。 */
  delayMs?: number;
  /** レンダリングするタグ（既定 div） */
  as?: MotionTag;
  /** 出現方向（既定 up＝下からフェードイン） */
  from?: keyof typeof INITIAL;
}

// design-reference の reveal 仕様:
// 初期 {opacity:0, y:20} → {opacity:1, y:0}, duration 0.75s,
// ease cubic-bezier(.22,.61,.36,1), once, viewport margin -7%
export function Reveal({ children, delayMs = 0, as = "div", from = "up", className, ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();
  // 複数タグの motion ユニオンを多態に扱うため ElementType に寄せる（onClick 等の型衝突回避）
  const Component = useMemo(() => MOTION_TAGS[as] as ElementType, [as]);

  // 動きを嫌うユーザーには静的表示（弱めるのではなく無くす）
  if (reduceMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={INITIAL[from]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1], delay: delayMs / 1000 }}
      {...rest}
    >
      {children}
    </Component>
  );
}
