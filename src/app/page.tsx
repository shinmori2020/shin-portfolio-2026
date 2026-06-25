import { Fragment } from "react";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { Phrase } from "@/components/common/ContactCTA";
import { ServiceIcon } from "@/components/common/ServiceIcon";
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
          <span className="text-accent">“つくる”</span>を、
          <br />
          技術で支える。
        </Reveal>
        <Reveal
          as="p"
          delayMs={90}
          className="mt-[clamp(28px,4vw,42px)] max-w-[44em] text-[clamp(14px,1.4vw,18px)] leading-[1.9] text-muted [text-wrap:pretty]"
        >
          <Phrase>WordPress制作の現場を知り、</Phrase>
          <wbr />
          <Phrase>Next.jsでモダンに作り直し、</Phrase>
          <wbr />
          <Phrase>AI実装まで踏み込む。</Phrase>
          <br />
          <Phrase>制作と開発、</Phrase>
          <wbr />
          <Phrase>その両方をひとりで完結できる</Phrase>
          <wbr />
          <Phrase>数少ないフロントエンドエンジニアです。</Phrase>
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
              ホームページ制作の保守・運用から、Next.js を使ったモダンなサイトづくり、そして AI を活用した機能の開発まで対応します。「RAG」（社内の資料をもとに AI が答えるしくみ）や「AIエージェント」（人の代わりに作業を進める AI）といった実装も手がけます。
            </p>
            <p className="mt-[18px] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              制作の現場を知っているので、進め方や納品・運用までスムーズです。派手な演出より、読みやすさと表示の速さを大切に。情報を詰め込みすぎず、文字の大きさと余白で伝える。発注する側が「安心して任せられる」と感じられる状態を、技術でつくります。
            </p>
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

        <div className="grid grid-cols-1 gap-[clamp(16px,2vw,24px)] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Reveal key={s.key} delayMs={s.delayMs} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-[clamp(28px,3vw,40px)] transition-[transform,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-[6px] hover:border-accent hover:shadow-[var(--shadow)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                {/* PC: アイコン左＋タイトル右。スマホ: 左右中央の縦並び。 */}
                <div className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-4 md:text-left">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    <ServiceIcon id={s.icon} />
                  </span>
                  <h3 className="m-0 text-[19px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                </div>
                <p className="m-0 text-center text-[14px] leading-[1.85] text-muted md:text-left">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

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

          <div className="grid grid-cols-1 gap-[clamp(20px,3vw,40px)] md:grid-cols-2">
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

        {/* 上から順に並ぶ縦フロー。ステップ間に下向き矢印で視線誘導。横幅は他セクションと同じ（〜1180px）。 */}
        <div>
          {processSteps.map((p, i) => (
            <Fragment key={p.no}>
              <Reveal delayMs={p.delayMs}>
                <div className="flex items-center gap-[clamp(16px,3vw,28px)] rounded-2xl border border-line bg-surface p-[clamp(22px,3vw,34px)] transition-[transform,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-[4px] hover:border-accent hover:shadow-[var(--shadow)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <span className="font-mono text-[clamp(26px,4vw,38px)] font-medium leading-none text-accent">{p.no}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-[clamp(16px,2vw,19px)] font-semibold tracking-[-0.01em]">{p.title}</h3>
                    <p className="m-0 text-[14px] leading-[1.85] text-muted">{p.desc}</p>
                  </div>
                </div>
              </Reveal>

              {/* コネクター（最後のステップ以外）。カードと同様にスクロール連動でフェードイン。 */}
              {i < processSteps.length - 1 && (
                <Reveal as="div" delayMs={120} aria-hidden className="flex justify-center py-[clamp(6px,1.4vw,12px)]">
                  <svg
                    width="22"
                    height="30"
                    viewBox="0 0 22 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <path d="M11 3 V22" />
                    <path d="M5 16 L11 24 L17 16" />
                  </svg>
                </Reveal>
              )}
            </Fragment>
          ))}
        </div>

        <Reveal className="mt-[clamp(28px,4vw,44px)]">
          <Link href="/#contact" className={`${btnSecondary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            相談する
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
          {/* 見出しは block で2行を固定（語の途中で切れない）。狭い画面でのみ内部で折り返す。 */}
          <Reveal
            as="h2"
            className="mx-auto m-0 max-w-[22em] text-[clamp(24px,4vw,44px)] font-medium leading-[1.35] tracking-[-0.025em]"
          >
            <span className="block">Webのこと、</span>
            <span className="block">技術で頼れる人を探していますか。</span>
          </Reveal>
          {/* 本文はフレーズ単位で折り返す（区切りを入れて語の途中で切れないように）。 */}
          <Reveal
            as="p"
            delayMs={80}
            className="mx-auto mt-[28px] max-w-[42em] text-[15px] leading-[1.9] text-muted [text-wrap:pretty]"
          >
            <Phrase>制作会社や事業者の方からの、</Phrase>
            <wbr />
            <Phrase>Web制作・開発・機能実装の</Phrase>
            <wbr />
            <Phrase>ご相談を歓迎します。</Phrase>
          </Reveal>
          <Reveal delayMs={150} className="mt-[44px] flex flex-wrap justify-center gap-[14px]">
            <a href="mailto:hello@example.com" className={`${btnPrimary} px-[30px] py-[15px] text-[14.5px]`}>
              相談する <span className="font-mono">→</span>
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
