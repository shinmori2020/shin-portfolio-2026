'use client';

import { useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

type Props = {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function TextField({
  label,
  error,
  required,
  className = '',
  ...rest
}: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm text-stone-800"
      >
        {label}
        {required && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[11px] text-stone-600">
            必須
          </span>
        )}
      </label>

      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none
          transition-[border-color,box-shadow] duration-200
          focus:ring-[3px]
          ${
            error
              ? 'border-red-800 focus:ring-red-800/10'
              : 'border-stone-300 focus:border-green-950 focus:ring-green-950/10'
          }
        `}
        {...rest}
      />

      {/* min-h でエラー文の高さを常時確保 → 出現してもCLSゼロ */}
      <div className="min-h-6 pt-1" aria-live="polite">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="text-xs text-red-800"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
