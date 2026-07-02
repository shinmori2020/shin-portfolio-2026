"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  name?: string;
  children: React.ReactNode; // ラベル文(プライバシーポリシーへのリンク込みで渡す)
};

const drawCheck = { duration: 0.15, ease: "easeOut", delay: 0.04 } as const;

export function ConsentCheckbox({ checked, onChange, error, name, children }: Props) {
  const reduce = useReducedMotion();

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <span className="relative mt-0.5 inline-flex">
          {/* ネイティブinputを残す: キーボード操作とフォーム送信値を無料で獲得 */}
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error}
            className={`
              size-5 cursor-pointer appearance-none rounded-[5px] border-[1.5px]
              bg-surface transition-colors duration-200
              checked:border-accent checked:bg-accent
              focus-visible:outline-none focus-visible:ring-[3px]
              focus-visible:ring-accent/15
              ${error ? "border-[#c0362c]" : "border-line-strong"}
            `}
          />
          <svg
            className="pointer-events-none absolute inset-0 m-auto"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            {checked && (
              <motion.path
                d="M2 6.5 L4.8 9.2 L10 3.2"
                stroke="var(--bg)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={drawCheck}
              />
            )}
          </svg>
        </span>
        <span className="leading-relaxed text-muted">{children}</span>
      </label>

      <div className="min-h-6 pt-1" aria-live="polite">
        {error && <p className="text-xs text-[#c0362c]">{error}</p>}
      </div>
    </div>
  );
}
