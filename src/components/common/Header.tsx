"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useScrolled } from "@/hooks/useScrolled";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/profile", label: "Profile" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  // スクロール時のみ罫線＋背景を不透明化（高さは変えない・transition は色のみ 200ms）
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-[12px] backdrop-saturate-[1.6] transition-[background-color,border-color] duration-200 motion-reduce:transition-none ${
        scrolled
          ? "border-line [background:color-mix(in_srgb,var(--bg)_88%,transparent)]"
          : "border-transparent [background:color-mix(in_srgb,var(--bg)_55%,transparent)]"
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-[clamp(20px,4vw,40px)] py-4">
        {/* ロゴは英字で統一。サイト内のラベル（FRONTEND ENGINEER — 2026 / SELECTED WORKS — 08）や
            ナビ（Works / Profile / Contact）がすべて英字のため 和文の「シン」だけが浮いていた。
            肩書きは「Web / Coding」より職種が明確な FRONTEND ENGINEER に揃える（ヒーローと同じ名乗り）。
            tracking は和文向けの負値をやめ 欧文大文字が締まって見える正値にする。 */}
        <Link
          href="/"
          className="flex items-baseline gap-[10px] text-ink no-underline"
        >
          <span className="text-[16px] font-semibold tracking-[0.04em]">SHIN</span>
          {/* 狭い画面では肩書きを畳む。ロゴ＋ナビが1行に収まらないとヘッダーが2段になり
              高さが 67px → 115px へ跳ねる（この文言に限らず 変更前から 390px 以下で起きていた）。
              480px を境にするのは 480px では収まり 430px では溢れる実測に基づく。
              肩書きはヒーローで即座に名乗るため 畳んでも情報は失われない。 */}
          <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted min-[480px]:inline">
            Frontend Engineer
          </span>
        </Link>

        <nav className="flex items-center gap-[clamp(16px,2.4vw,30px)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[13.5px] tracking-[0.02em] text-muted no-underline transition-colors duration-[250ms] after:absolute after:-bottom-[3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(.22,.61,.36,1)] hover:text-ink hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
