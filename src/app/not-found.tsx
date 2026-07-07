import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";

// 404 は検索対象外
export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: false },
};

// CTA は既存(トップ ヒーロー)と同じ語彙を再利用
const btnBase =
  "group inline-flex items-center gap-[10px] rounded-full no-underline transition-[border-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none";
const btnArrow =
  "font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none";
const btnPrimary = `${btnBase} bg-accent text-white`;
const btnSecondary = `${btnBase} border border-line-strong text-ink hover:border-accent`;

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1180px] flex-col justify-center px-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,148px)] pb-[clamp(48px,7vw,96px)]">
      <Reveal className="mb-[clamp(24px,4vw,40px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
        404 — NOT FOUND
      </Reveal>
      <Reveal
        as="h1"
        delayMs={80}
        className="m-0 max-w-[16em] text-[clamp(28px,4.6vw,52px)] font-medium leading-[1.28] tracking-[-0.025em]"
      >
        お探しのページは見つかりませんでした。
      </Reveal>
      <Reveal
        as="p"
        delayMs={160}
        className="mt-[clamp(20px,3vw,32px)] max-w-[40em] text-[clamp(14px,1.4vw,17px)] leading-[1.9] text-muted"
      >
        URLが変わったか ページが移動した可能性があります。
      </Reveal>
      <Reveal delayMs={240} className="mt-[clamp(32px,5vw,48px)] flex flex-wrap gap-[14px]">
        <Link href="/" className={`${btnPrimary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
          トップへ戻る<span className={btnArrow}>→</span>
        </Link>
        <Link href="/works" className={`${btnSecondary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
          制作物を見る
        </Link>
      </Reveal>
    </section>
  );
}
