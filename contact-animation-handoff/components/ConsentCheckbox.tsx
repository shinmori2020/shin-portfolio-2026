'use client';

import { motion, useReducedMotion } from 'motion/react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: React.ReactNode; // ラベル文(プライバシーポリシーへのリンク込みで渡す)
};

export function ConsentCheckbox({ checked, onChange, error, children }: Props) {
  const reduce = useReducedMotion();

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <span className="relative mt-0.5 inline-flex">
          {/* ネイティブinputを残す: キーボード操作とフォーム送信値を無料で獲得 */}
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error}
            className={`
              size-5 cursor-pointer appearance-none rounded-[5px] border-[1.5px]
              bg-white transition-colors duration-200
              checked:border-green-950 checked:bg-green-950
              focus-visible:outline-none focus-visible:ring-[3px]
              focus-visible:ring-green-950/15
              ${error ? 'border-red-800' : 'border-stone-400'}
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
                stroke="#F7F5EE"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.15, ease: 'easeOut', delay: 0.04 }}
              />
            )}
          </svg>
        </span>
        <span className="leading-relaxed text-stone-600">{children}</span>
      </label>

      <div className="min-h-6 pt-1" aria-live="polite">
        {error && <p className="text-xs text-red-800">{error}</p>}
      </div>
    </div>
  );
}
