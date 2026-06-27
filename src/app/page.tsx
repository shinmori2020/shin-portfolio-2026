import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { Phrase } from "@/components/common/ContactCTA";
import { ServicesSwitcher } from "@/components/common/ServicesSwitcher";
import { Underlined } from "@/components/common/Underlined";
import { DrawLine } from "@/components/common/DrawLine";
import { Parallax } from "@/components/common/Parallax";
import { works } from "@/data/works";
import { defaultCards, serviceTopics } from "@/data/services";
import { processSteps } from "@/data/process";

// 案件獲得ファネル型の TOP:
// Hero → About → Services → Works → Process → Contact
// ブランド（洗練・引き算・速度）は維持し、CTA（相談）を各所に分散配置する。

// --- CTA ボタンの共通スタイル ---
const btnBase =
  "group inline-flex items-center gap-[10px] rounded-full no-underline transition-[border-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none";

// ボタン内の矢印（ホバーで右に滑る）
const btnArrow =
  "font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none";
const btnPrimary = `${btnBase} bg-accent text-white`;
const btnSecondary = `${btnBase} border border-line-strong text-ink hover:border-accent`;

// 斜線プレースホルダー背景（実画像未用意の箇所で使用）
const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px)]";

// セクション見出しラベル（モノスペース番号）
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] tracking-[0.1em] text-faint">{children}</span>
  );
}

// セクション見出し（ラベルを上、タイトルを下に縦積み）。全セクション共通の構成。
function SectionHeading({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <DrawLine className="mt-[14px] w-10" />
      <h2 className="mt-[14px] text-[clamp(22px,3vw,34px)] font-medium leading-[1.4] tracking-[-0.02em]">
        {children}
      </h2>
    </div>
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
          className="m-0 max-w-[18em] text-[clamp(30px,5.2vw,60px)] font-medium leading-[1.22] tracking-[-0.025em]"
        >
          <Phrase>デザインの現場と</Phrase>
          <wbr />
          <Phrase>開発の最前線。</Phrase>
          <br />
          その<Underlined>“あいだ”</Underlined>をつなぐ。
        </Reveal>
        <Reveal
          as="p"
          delayMs={90}
          className="mt-[clamp(28px,4vw,42px)] max-w-[44em] text-[clamp(14px,1.4vw,18px)] leading-[1.9] text-muted [text-wrap:pretty]"
        >
          <Phrase>制作と開発の両方がわかります。</Phrase>
          <wbr />
          <Phrase>だからデザインの意図や細かなこだわりをくずさないまま</Phrase>
          <wbr />
          <Phrase>実際に動くサイトへ落とし込めます。</Phrase>
          <wbr />
          <Phrase>表示の速さや公開後の運用のしやすさまで考えて作ります。</Phrase>
        </Reveal>
        <Reveal delayMs={170} className="mt-[clamp(36px,5vw,52px)] flex flex-wrap gap-[14px]">
          <Link href="/#contact" className={`${btnPrimary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
            相談する<span className={btnArrow}>→</span>
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
              制作と開発の<Underlined>“あいだ”</Underlined>に立つ。
            </h2>
            <p className="mt-[clamp(20px,3vw,28px)] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              スタートはホームページ制作の現場。保守や運用から新規構築まで一通り手がけてきました。そこからNext.jsを中心にしたモダンな開発へと領域を広げています。制作から開発までをまとめて引き受けられるのが軸です。AIについては「取り入れるべきか」「どこに活かせるか」という段階からご相談いただけます。
            </p>
            <p className="mt-[18px] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              現場を知っているぶん進め方や納品・運用まで見通しを立てやすいです。重視するのは派手な演出より読みやすさと表示の速さ。情報を詰め込みすぎず文字の大きさと余白で伝えます。発注する側が「安心して任せられる」と感じられる状態を技術でつくります。
            </p>
          </Reveal>

          {/* ポートレート（任意・未用意なら斜線プレースホルダー）*/}
          <Reveal delayMs={90} from="right" className="flex flex-[1_1_260px]">
            <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {/* 軽いパララックス。中身を大きめに置いて端の隙間を防ぐ。 */}
                <Parallax range={16} className="absolute inset-x-0 -top-[8%] h-[116%]">
                  <div className={`h-full w-full ${hatch}`} />
                </Parallax>
                <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.08em] text-faint">
                  portrait
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 02 / SERVICES ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
        <Reveal>
          <SectionHeading label="02 / Services">頼めること</SectionHeading>
        </Reveal>

        {/* 導入: 制作と開発の両方＝あいだをつなぐ強み */}
        <Reveal delayMs={60} className="mt-[clamp(20px,3vw,28px)]">
          <p className="m-0 max-w-[44em] text-[clamp(15px,1.6vw,18px)] leading-[1.8] tracking-[-0.01em] [text-wrap:pretty]">
            強みは制作と開発の両方を扱えること。だから境目で品質を落とさず仕上げられます。
          </p>
        </Reveal>

        {/* ピルで上の2カードが切り替わるインタラクティブ表示 */}
        <Reveal delayMs={60}>
          <ServicesSwitcher defaultCards={defaultCards} topics={serviceTopics} />
        </Reveal>
      </section>

      {/* ===== 03 / WORKS ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="mb-[clamp(36px,5vw,60px)] flex flex-wrap items-end justify-between gap-6">
            <SectionHeading label="03 / Selected works">制作物</SectionHeading>
            <Link
              href="/works"
              className="group border-b border-line-strong pb-[3px] text-[13.5px] text-ink no-underline transition-colors duration-[250ms] hover:border-accent hover:text-accent"
            >
              すべて見る{" "}
              <span className="inline-block font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none">
                →
              </span>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-[clamp(20px,3vw,40px)] md:grid-cols-2">
            {works.map((w) => (
              <Reveal key={w.slug} delayMs={w.delayMs}>
                <Link
                  href={`/works/${w.slug}`}
                  className="group flex flex-col gap-[18px] text-ink no-underline"
                >
                  <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow)]">
                    <div className="flex items-center gap-[6px] border-b border-line bg-surface-2 px-[14px] py-[11px]">
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="h-[9px] w-[9px] rounded-full bg-line-strong" />
                      <span className="ml-[10px] font-mono text-[10.5px] text-faint">{w.url}</span>
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div
                        className={`grid h-full w-full place-items-center ${hatch} transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100`}
                      >
                        <span className="font-mono text-[11px] tracking-[0.08em] text-faint">screenshot</span>
                      </div>
                      {/* ホバーで View → が浮かぶ */}
                      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 [background:rgba(15,18,14,0.45)] group-hover:opacity-100 motion-reduce:transition-none">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 font-mono text-[12px] text-white">
                          View →
                        </span>
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
        <Reveal className="mb-[clamp(36px,5vw,60px)]">
          <SectionHeading label="04 / Process">進め方</SectionHeading>
        </Reveal>

        {/* 縦タイムライン：左の縦線＋番号バッジで上から順の流れを示す（枠なし・軽量）*/}
        <ol className="relative m-0 list-none p-0">
          {processSteps.map((p, i) => (
            <Reveal
              as="li"
              key={p.no}
              delayMs={p.delayMs}
              className="group flex gap-[clamp(16px,3vw,24px)]"
            >
              {/* 番号バッジ＋つなぎの縦線 */}
              <div className="flex flex-col items-center">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-[14px] text-accent transition-colors duration-300 group-hover:border-accent">
                  {p.no}
                </span>
                {i < processSteps.length - 1 && (
                  <span aria-hidden className="mt-2 w-px grow bg-line" />
                )}
              </div>

              {/* 内容 */}
              <div className="pt-[6px] pb-[clamp(28px,5vw,48px)]">
                <h3 className="m-0 text-[clamp(16px,2vw,19px)] font-semibold tracking-[-0.01em]">{p.title}</h3>
                <p className="m-0 mt-2 max-w-[60ch] text-[14px] leading-[1.85] text-muted">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>

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
            <span className="block">Webのこと</span>
            <span className="block">技術で頼れる人を探していますか。</span>
          </Reveal>
          {/* 本文はフレーズ単位で折り返す（区切りを入れて語の途中で切れないように）。 */}
          <Reveal
            as="p"
            delayMs={80}
            className="mx-auto mt-[28px] max-w-[42em] text-[15px] leading-[1.9] text-muted [text-wrap:pretty]"
          >
            <Phrase>制作会社や事業者の方からのご相談を歓迎します。</Phrase>
            <wbr />
            <Phrase>Web制作・開発・機能実装まで対応します。</Phrase>
          </Reveal>
          <Reveal delayMs={150} className="mt-[44px] flex flex-wrap justify-center gap-[14px]">
            <a href="mailto:hello@example.com" className={`${btnPrimary} px-[30px] py-[15px] text-[14.5px]`}>
              相談する <span className={btnArrow}>→</span>
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
