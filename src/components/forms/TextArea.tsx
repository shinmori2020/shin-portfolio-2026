"use client";

import { useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// TextField を textarea 向けに派生したもの（設計ルールは同一：ラベル/必須バッジ/
// エラー min-h 常時確保/フェード/reduced-motion 分岐）。
type Props = {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

const fade = { duration: 0.18, ease: "easeOut" } as const;

export function TextArea({ label, error, required, className = "", ...rest }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center text-sm text-ink">
        {label}
        {required ? (
          <span className="ml-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2 py-[2px] text-[11px] text-accent">
            必須
          </span>
        ) : (
          <span className="ml-2 text-[11px] text-faint">任意</span>
        )}
      </label>

      <textarea
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full resize-y rounded-lg border bg-surface px-4 py-3 text-sm leading-[1.8] text-ink outline-none
          transition-[border-color,box-shadow] duration-200 placeholder:text-faint
          focus:ring-[3px]
          ${
            error
              ? "border-[#c0362c] focus:ring-[#c0362c]/10"
              : "border-line focus:border-accent focus:ring-accent/10"
          }
        `}
        {...rest}
      />

      <div className="min-h-6 pt-1" aria-live="polite">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={fade}
              className="text-xs text-[#c0362c]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
