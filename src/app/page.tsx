import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { works } from "@/data/works";
import { services } from "@/data/services";
import { processSteps } from "@/data/process";

// 案件獲得ファネル型の TOP:
// Hero → About → Services → Works → Process → Contact
// ブランド（洗練・引き算・速度）は維持し、CTA（相談）を各所に分散配置する。

// --- CTA ボタンの共通スタイル ---
const btnBase =
  "inline-flex items-center gap-[10px] rounded-full no-underline transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const btnPrimary = `${btnBase} bg-accent text-white hover:-translate-y-[2px] hover:shadow-[0_14px_30px_-12px_var(--accent)]`;
const btnSecondary = `${btnBase} border border-line-strong text-ink hover:-translate-y-[2px] hover:border-accent`;

// 斜線プレースホルダー背景（実画像未用意の箇所で使用）
const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px)]";

// セクション見出しラベル（モノスペース番号）
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] tracking-[0.1em] text-faint">{children}</span>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,148px)] pb-[clamp(48px,7vw,96px)]">
        <Reveal className="mb-[clamp(28px,5vw,52px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          Frontend Engineer — 2026
        </Reveal>
        <Reveal
          as="h1"
          className="m-0 max-w-[16ch] text-[clamp(34px,6.4vw,76px)] font-medium leading-[1.18] tracking-[-0.025em] [text-wrap:balance]"
        >
          制作会社の<span className="text-accent">“つくる”</span>を、
          <br />
          技術で前に進める。
        </Reveal>
        <Reveal
          as="p"
          delayMs={90}
          className="mt-[clamp(28px,4vw,42px)] max-w-[54ch] text-[clamp(15px,1.5vw,19px)] leading-[1.95] text-muted"
        >
          WordPress制作の現場を知り、Next.jsでモダンに作り直し、AI実装まで踏み込む。
          <br />
          制作と開発、その両方をひとりで完結できる数少ないフロントエンドエンジニアです。
        </Reveal>
        <Reveal delayMs={170} className="mt-[clamp(36px,5vw,52px)] flex flex-wrap gap-[14px]">
          <Link href="/#contact" className={`${btnPrimary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            相談する<span className="font-mono">→</span>
          </Link>
          <Link href="/works" className={`${btnSecondary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            制作物を見る
          </Link>
        </Reveal>
      </section>

      {/* ===== 01 / ABOUT ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto flex max-w-[1180px] flex-wrap gap-[clamp(32px,6vw,80px)] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="flex flex-[1.4_1_360px] flex-col">
            <SectionLabel>01 / About</SectionLabel>
            <h2 className="mb-0 mt-[18px] text-[clamp(22px,3vw,34px)] font-medium leading-[1.4] tracking-[-0.02em]">
              制作の現場を知る、開発者。
            </h2>
            <p className="mt-[clamp(20px,3vw,28px)] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              WordPress制作の保守・構築から始まり、Next.js を中心としたモダンな実装、そして
              RAG やエージェントといった AI 実装まで。制作会社の進行・納品・運用を理解したうえで、技術で品質と速度を引き上げます。
            </p>
            <p className="mt-[18px] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              派手な演出より、余白と速度。情報を詰め込まず、タイポグラフィの階層で伝える。「安心して任せられる」状態を、技術でつくります。
            </p>
            <div className="mt-[clamp(24px,3vw,32px)] rounded-2xl border border-line bg-surface p-[clamp(20px,2.5vw,28px)]">
              <span className="font-mono text-[12px] tracking-[0.06em] text-accent">Rare combination</span>
              <p className="m-0 mt-3 text-[clamp(15px,1.6vw,19px)] leading-[1.7] tracking-[-0.01em]">
                <strong className="font-semibold">WordPress制作経験</strong> ×{" "}
                <strong className="font-semibold">Next.js</strong> ×{" "}
                <strong className="font-semibold">AI実装</strong>。
                <span className="text-muted">この3つを併せ持つ人材は、市場にほとんどいません。</span>
              </p>
            </div>
          </Reveal>

          {/* ポートレート（任意・未用意なら斜線プレースホルダー）*/}
          <Reveal delayMs={90} className="flex flex-[1_1_260px]">
            <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
              <div className={`grid aspect-[4/5] w-full place-items-center ${hatch}`}>
                <span className="font-mono text-[11px] tracking-[0.08em] text-faint">portrait</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 02 / SERVICES ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
        <Reveal className="mb-[clamp(32px,5vw,56px)] flex flex-wrap items-baseline gap-4">
          <SectionLabel>02 / Services</SectionLabel>
          <h2 className="m-0 text-[clamp(22px,3vw,34px)] font-medium tracking-[-0.02em]">頼めること</h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {services.map((s) => (
            <Reveal
              key={s.key}
              delayMs={s.delayMs}
              className="flex flex-col gap-4 bg-surface p-[clamp(28px,3vw,40px)]"
            >
              <span className="font-mono text-[11px] tracking-[0.1em] text-accent">{s.key}</span>
              <h3 className="m-0 text-[19px] font-semibold tracking-[-0.01em]">{s.title}</h3>
              <p className="m-0 text-[14px] leading-[1.85] text-muted">{s.desc}</p>
            </Reveal>
          ))}
        </div>

        {/* 契約の幅（料金は出さず、相談に寄せる）＋ 第二CTA */}
        <Reveal className="mt-[clamp(28px,4vw,44px)] flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-surface-2 p-[clamp(24px,3vw,36px)]">
          <p className="m-0 max-w-[44ch] text-[clamp(15px,1.6vw,18px)] leading-[1.7] tracking-[-0.01em]">
            継続パートナー委託・スポット開発・機能実装、いずれも対応します。
            <span className="text-muted">まずは内容をお聞かせください。</span>
          </p>
          <Link href="/#contact" className={`${btnPrimary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            相談する<span className="font-mono">→</span>
          </Link>
        </Reveal>
      </section>

      {/* ===== 03 / WORKS ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="mb-[clamp(36px,5vw,60px)] flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-wrap items-baseline gap-4">
              <SectionLabel>03 / Selected works</SectionLabel>
              <h2 className="m-0 text-[clamp(22px,3vw,34px)] font-medium tracking-[-0.02em]">制作物</h2>
            </div>
            <Link
              href="/works"
              className="border-b border-line-strong pb-[3px] text-[13.5px] text-ink no-underline transition-colors duration-[250ms] hover:border-accent hover:text-accent"
            >
              すべて見る →
            </Link>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[clamp(20px,3vw,40px)]">
            {works.map((w) => (
              <Reveal key={w.slug} delayMs={w.delayMs}>
                <Link
                  href={`/works/${w.slug}`}
                  className="group flex flex-col gap-[18px] text-ink no-underline transition-transform duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-[6px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow)]">
                    <div className="flex items-center gap-[6px] border-b border-line bg-surface-2 px-[14px] py-[11px]">
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="ml-[10px] font-mono text-[10.5px] text-faint">{w.url}</span>
                    </div>
                    <div className="aspect-[16/10] overflow-hidden">
                      <div
                        className={`grid h-full w-full place-items-center ${hatch} transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100`}
                      >
                        <span className="font-mono text-[11px] tracking-[0.08em] text-faint">screenshot</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] text-accent">{w.no}</span>
                    <h3 className="m-0 text-[17px] font-semibold leading-[1.5] tracking-[-0.01em]">{w.title}</h3>
                  </div>
                  <p className="m-0 text-[13.5px] leading-[1.8] text-muted">{w.desc}</p>
                  <div className="flex flex-wrap gap-[7px]">
                    {w.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-line px-[9px] py-[4px] font-mono text-[10.5px] tracking-[0.02em] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 04 / PROCESS ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
        <Reveal className="mb-[clamp(36px,5vw,60px)] flex flex-wrap items-baseline gap-4">
          <SectionLabel>04 / Process</SectionLabel>
          <h2 className="m-0 text-[clamp(22px,3vw,34px)] font-medium tracking-[-0.02em]">進め方</h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {processSteps.map((p) => (
            <Reveal
              key={p.no}
              delayMs={p.delayMs}
              className="flex flex-col gap-3 bg-surface p-[clamp(24px,2.6vw,34px)]"
            >
              <span className="font-mono text-[22px] font-medium leading-none text-accent">{p.no}</span>
              <h3 className="m-0 mt-1 text-[16px] font-semibold tracking-[-0.01em]">{p.title}</h3>
              <p className="m-0 text-[13.5px] leading-[1.8] text-muted">{p.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-[clamp(28px,4vw,44px)]">
          <Link href="/#contact" className={`${btnSecondary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            まずは相談する
          </Link>
        </Reveal>
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="border-t border-line bg-surface-2"
      >
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(72px,11vw,150px)] text-center">
          <Reveal className="mb-[28px] font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
            Let&apos;s talk
          </Reveal>
          <Reveal
            as="h2"
            className="mx-auto m-0 max-w-[18ch] text-[clamp(28px,5vw,56px)] font-medium leading-[1.3] tracking-[-0.025em] [text-wrap:balance]"
          >
            継続的に任せられる、
            <br />
            技術パートナーを探していますか。
          </Reveal>
          <Reveal
            as="p"
            delayMs={80}
            className="mx-auto mt-[28px] max-w-[46ch] text-[15px] leading-[1.9] text-muted"
          >
            制作会社からの委託・モダン技術での開発・機能実装のご相談を歓迎します。お気軽にどうぞ。
          </Reveal>
          <Reveal delayMs={150} className="mt-[44px] flex flex-wrap justify-center gap-[14px]">
            <a href="mailto:hello@example.com" className={`${btnPrimary} px-[30px] py-[15px] text-[14.5px]`}>
              メールで相談する <span className="font-mono">→</span>
            </a>
            <Link href="/profile" className={`${btnSecondary} px-[30px] py-[15px] text-[14.5px]`}>
              プロフィールを見る
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
