import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { BrowserFrame } from "@/components/common/BrowserFrame";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "制作物",
  description:
    "シンの制作物。制作（WordPress）と開発（モダンフロント）そして業務効率化ツールまで 領域をまたいだ仕事を紹介します。",
};

const btnPrimary =
  "group inline-flex items-center gap-[10px] rounded-full bg-accent px-[30px] py-[15px] text-[14.5px] text-white no-underline";
const btnArrow =
  "font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none";

export default function WorksPage() {
  return (
    <>
      {/* ===== PAGE HEADER ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(56px,9vw,120px)] pb-[clamp(40px,6vw,72px)]">
        <Reveal className="mb-[24px] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          Selected works — {String(works.length).padStart(2, "0")}
        </Reveal>
        <Reveal
          as="h1"
          className="m-0 text-[clamp(32px,5.4vw,64px)] font-medium leading-[1.2] tracking-[-0.025em]"
        >
          制作物
        </Reveal>
        <Reveal as="p" delayMs={80} className="mt-6 text-[clamp(14px,1.4vw,17px)] leading-[1.9] text-muted">
          制作（WordPress）と開発（モダンフロント）そして業務効率化ツールまで 領域をまたいだ仕事を紹介します。
        </Reveal>
      </section>

      {/* ===== WORKS GRID ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pb-[clamp(72px,10vw,140px)]">
        <div className="grid gap-[clamp(24px,3.4vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          {works.map((w) => (
            <Reveal key={w.slug} delayMs={w.delayMs}>
              <Link href={`/works/${w.slug}`} className="group flex flex-col gap-5 text-ink no-underline">
                <BrowserFrame
                  url={w.url}
                  ratio="16 / 10"
                  image={w.image}
                  className="transition-colors group-hover:border-line-strong"
                />
                <div className="flex items-baseline gap-[14px]">
                  <span className="font-mono text-[13px] text-accent">{w.no}</span>
                  <div className="flex flex-col gap-[10px]">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
                      {w.kind}
                    </span>
                    <h3 className="m-0 text-[clamp(18px,1.8vw,21px)] font-semibold leading-[1.5] tracking-[-0.015em]">
                      {w.title}
                    </h3>
                  </div>
                </div>
                <p className="m-0 pl-[30px] text-[14px] leading-[1.85] text-muted">{w.desc}</p>
                <div className="flex flex-wrap gap-[7px] pl-[30px]">
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-line px-[9px] py-1 font-mono text-[10.5px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-[2px] inline-flex items-center gap-2 pl-[30px] text-[13px] text-accent">
                  詳細を見る
                  <span
                    aria-hidden
                    className="font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CONTACT STRIP ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-8 px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
          <Reveal>
            <h2 className="m-0 text-[clamp(22px,3vw,34px)] font-medium leading-[1.4] tracking-[-0.02em]">
              継続パートナーをお探しなら。
            </h2>
            <p className="m-0 mt-4 text-[14.5px] leading-[1.8] text-muted">
              制作会社や事業者からのご相談を歓迎します。モダン技術での開発や機能実装まで対応します。
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <Link href="/contact" className={`${btnPrimary} whitespace-nowrap`}>
              相談する <span className={btnArrow}>→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
