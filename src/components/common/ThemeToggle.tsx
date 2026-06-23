"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? (isDark ? "ライトモードに切替" : "ダークモードに切替") : "テーマを切替"}
      // design-reference: 34px 円形 / 1px line-strong / hover で accent + rotate 18deg
      className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full border border-line-strong bg-transparent text-[14px] text-ink transition-[border-color,transform] duration-[250ms] hover:rotate-[18deg] hover:border-accent motion-reduce:transition-none motion-reduce:hover:rotate-0"
    >
      {/* ハイドレーション前は同サイズの透明プレースホルダー（mismatch / CLS 回避） */}
      <span aria-hidden="true" className="leading-none">
        {!mounted ? "" : isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
