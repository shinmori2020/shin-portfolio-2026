"use client";

import { useId } from "react";

// TextField と見た目を揃えた任意のセレクト。検証は不要だが、フィールドの高さ・
// エラー領域(min-h)を他フィールドと合わせて行の揃いと CLS を維持する。
type Props = {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  placeholder = "選択してください",
  className = "",
}: Props) {
  const id = useId();

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

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-line bg-surface px-4 pr-10 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:ring-[3px] focus:ring-accent/10"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted"
        >
          ▾
        </span>
      </div>

      {/* 他フィールドと高さを揃えるためのスペーサー */}
      <div className="min-h-6 pt-1" />
    </div>
  );
}
