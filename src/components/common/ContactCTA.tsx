import Link from "next/link";
import type { ReactNode } from "react";

// 再利用可能な「相談バナー」。Services 以外（Process / 各ページ末尾など）でも使える。
// メッセージは children で受け取り、フレーズ単位の折り返しは呼び出し側で <Phrase> を使う。

const ctaButton =
  "inline-flex shrink-0 items-center gap-[10px] whitespace-nowrap rounded-full bg-accent px-[26px] py-[14px] text-[14px] tracking-[0.02em] text-white no-underline";

interface ContactCTAProps {
  children: ReactNode;
  /** ボタン文言 */
  label?: string;
  /** リンク先（既定は Home の #contact） */
  href?: string;
  /** ラッパーに足すクラス（余白調整など） */
  className?: string;
}

export function ContactCTA({
  children,
  label = "相談する",
  href = "/#contact",
  className = "",
}: ContactCTAProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-2xl border border-line bg-surface-2 p-[clamp(24px,3vw,36px)] ${className}`}
    >
      <p className="m-0 flex-1 text-[clamp(15px,1.6vw,18px)] leading-[1.9] tracking-[-0.01em] [text-wrap:pretty]">
        {children}
      </p>
      <Link href={href} className={ctaButton}>
        {label}
        <span className="font-mono" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}

// フレーズ単位で折り返すための inline-block ラッパー（日本語が単語途中で切れるのを防ぐ）。
export function Phrase({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block ${className}`}>{children}</span>;
}
