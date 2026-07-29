"use client";

import Link from "next/link";
import { SiteLogo } from "./SiteLogo";
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
        {/* 狭い画面では肩書きを畳む。ロゴ＋ナビが1行に収まらないとヘッダーが2段になり
            高さが 67px → 115px へ跳ねる（この文言に限らず 変更前から 390px 以下で起きていた）。
            境界の 520px は「510px で収まり 505px で溢れる」実測にフォント読み込み時の
            揺れ分の余裕を足した値。肩書きはヒーローで即座に名乗るため 畳んでも情報は失われない。
            フッターはロゴ単独の行になるため畳む必要がなく そちらでは常に出す。 */}
        <SiteLogo titleClassName="hidden min-[520px]:inline" />

        <nav className="flex items-center gap-[clamp(16px,2.4vw,30px)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              // py-[6px] は指で押せる高さの確保（20px → 32px / WCAG 2.2 の基準は24px）。
              // 最も背の高いテーマ切替ボタン（34px）を超えないためヘッダーの高さは変わらない。
              // 下線は絶対配置なのでパディングぶん下がる。6px - 3px = 3px を指定して元の位置に戻す。
              className="relative py-[6px] text-[13.5px] tracking-[0.02em] text-muted no-underline transition-colors duration-[250ms] after:absolute after:bottom-[3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(.22,.61,.36,1)] hover:text-ink hover:after:scale-x-100 motion-reduce:after:transition-none"
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
