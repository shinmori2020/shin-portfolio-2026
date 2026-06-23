"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ElementType, ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  /** data-reveal-delay 相当（ミリ秒）。design-reference の値をそのまま渡す。 */
  delayMs?: number;
  /** レンダリングする要素（div 以外にしたい時） */
  as?: ElementType;
}

// design-reference の reveal 仕様:
// 初期 {opacity:0, y:20} → {opacity:1, y:0}, duration 0.75s,
// ease cubic-bezier(.22,.61,.36,1), once, viewport margin -7%
export function Reveal({ children, delayMs = 0, as, className, ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = (as ? motion.create(as) : motion.div) as typeof motion.div;

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-7%" }}
      transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1], delay: delayMs / 1000 }}
      {...rest}
    >
      {children}
    </Component>
  );
}
