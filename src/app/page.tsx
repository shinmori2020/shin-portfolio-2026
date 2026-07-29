import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/common/Reveal";
import { TransitionLink } from "@/components/common/TransitionLink";
import { Phrase } from "@/components/common/ContactCTA";
import { ServicesSwitcher } from "@/components/common/ServicesSwitcher";
import { ProcessTimeline } from "@/components/common/ProcessTimeline";
import { Underlined } from "@/components/common/Underlined";
import { HeadingChars } from "@/components/common/HeadingChars";
import { HeroBackdrop } from "@/components/common/HeroBackdrop";
import { DrawLine } from "@/components/common/DrawLine";
import { Portrait } from "@/components/common/Portrait";
import { JsonLd } from "@/components/common/JsonLd";
import { SectionHeading, SectionLabel } from "@/components/common/SectionHeading";
import { works } from "@/data/works";
import { profile } from "@/data/profile";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_ROLE } from "@/lib/site";
import { resolveWorkCover } from "@/lib/workImages";
import { resolvePortrait } from "@/lib/portraitImage";
import { BLUR_DATA_URL } from "@/lib/blur";
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
const btnPrimary = `${btnBase} bg-accent text-on-accent`;
const btnSecondary = `${btnBase} border border-line-strong text-ink hover:border-accent`;

// 斜線プレースホルダー背景（実画像未用意の箇所で使用）
// 斜線パターン＋不透明な下地(surface)。下地が無いと隙間が透けて、共有要素遷移で
// 移動元スナップショット(ホバースクリム)が透過して黒い縞になる。docs/view-transitions.md 参照。
const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px),var(--surface)]";

// 制作物ティーザーのスクリーンショット領域。
// 画像の解決規約は /works・詳細ヒーローと共通（public/works/{slug}/cover.*）。
// 共有要素遷移の要点は2つ。どちらも docs/view-transitions.md 参照:
//   1. view-transition-name は画像(またはプレースホルダー)を包む不透明な箱へ付与する
//   2. ホバースクリムはその箱の外に置き 移動元スナップショットへ焼き込ませない
function WorkShot({ slug, image }: { slug: string; image?: string }) {
  const cover = resolveWorkCover(slug, image);
  const zoom =
    "transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100";

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <div
        className="relative h-full w-full bg-surface"
        style={{ viewTransitionName: `work-shot-${slug}`, viewTransitionClass: "work-shot" }}
      >
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 560px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={`object-cover ${zoom}`}
          />
        ) : (
          <div className={`grid h-full w-full place-items-center ${hatch} ${zoom}`}>
            <span className="font-mono text-[11px] tracking-[0.08em] text-faint">screenshot</span>
          </div>
        )}
      </div>
      {/* ホバーで「詳細を見る」が浮かぶ（文言は /works の一覧カードと統一）*/}
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 [background:rgba(15,18,14,0.45)] group-hover:opacity-100 motion-reduce:transition-none">
        {/* 和文に font-mono を当てない（Geist Mono に和文グリフが無く OS 標準の
            等幅へ落ちるため）。記号の矢印だけ mono にする。/works の一覧と同じ扱い。 */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-[12px] text-white">
          詳細を見る
          <span aria-hidden className="font-mono">
            →
          </span>
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 構造化データ。ポートフォリオの主体は個人なので Person を軸にし
          サイト自体を WebSite として関連づける。表示には影響しない。 */}
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: AUTHOR_NAME,
            url: SITE_URL,
            jobTitle: AUTHOR_ROLE,
            description: profile.bio,
            knowsAbout: ["Next.js", "React", "TypeScript", "WordPress", "Web アクセシビリティ", "表示速度改善"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: "ja",
            author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
          },
        ]}
      />
      {/* ===== HERO ===== */}
      {/* 背景「木漏れ日×組版方眼」を最初の子に。振り付けはアイドル後(data-armed)で発火し LCP を遅らせない。
          コンテンツは relative z-10 で前面。見出し(LCP)は即描画のまま、説明文/CTA/下線をタイムテーブルへ再調整。 */}
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,148px)] pb-[clamp(48px,7vw,96px)]">
          <Reveal priority className="mb-[clamp(28px,5vw,52px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            Frontend Engineer — 2026
          </Reveal>
          <Reveal
            priority
            as="h1"
            className="m-0 max-w-[18em] text-[clamp(30px,5.2vw,60px)] font-medium leading-[1.22] tracking-[-0.025em]"
          >
            <Phrase>デザインの現場と</Phrase>
            <wbr />
            <Phrase>開発の最前線。</Phrase>
            <br />
            その
            <Underlined underlineDelay={0.98} underlineDuration={0.5}>
              “あいだ”
            </Underlined>
            をつなぐ。
          </Reveal>
          <Reveal
            priority
            as="p"
            delayMs={880}
            className="wrap-phrase mt-[clamp(28px,4vw,42px)] max-w-[44em] text-[clamp(14px,1.4vw,18px)] leading-[1.9] text-muted [text-wrap:pretty]"
          >
            <Phrase>制作と開発の両方がわかります。</Phrase>
            <wbr />
            <Phrase>だからデザインの意図や細かなこだわりをくずさないまま</Phrase>
            <wbr />
            <Phrase>実際に動くサイトへ落とし込めます。</Phrase>
            <wbr />
            <Phrase>表示の速さや公開後の運用のしやすさまで考えて作ります。</Phrase>
          </Reveal>
          <Reveal priority delayMs={1020} className="mt-[clamp(36px,5vw,52px)] flex flex-wrap gap-[14px]">
            <Link href="/#contact" className={`${btnPrimary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
              相談する<span className={btnArrow}>→</span>
            </Link>
            <Link href="/works" className={`${btnSecondary} px-[26px] py-[14px] text-[14px] tracking-[0.02em]`}>
              制作物を見る
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== 01 / ABOUT ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto flex max-w-[1180px] flex-wrap gap-[clamp(32px,6vw,80px)] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,104px)]">
          <Reveal priority className="flex flex-[1.4_1_360px] flex-col">
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

          {/* ポートレート（public/profile/portrait.* を置くだけで反映）*/}
          <Reveal priority delayMs={90} from="right" className="flex flex-[1_1_260px]">
            {/* sizes は「枠の幅」ではなく「実際に描かれる画像の幅」を渡すこと。
                正方形画像を縦長(4:5)の枠へ object-cover で入れると高さ基準で拡大され
                横幅は枠からはみ出して切られる。さらにパララックスで枠より16%高く描くため
                実寸は 425x531 の枠に対して約620px幅になる。枠の幅を渡すと
                ブラウザが小さい候補を選び 高解像度ディスプレイで眠くなる。 */}
            <Portrait
              ratio="4 / 5"
              image={resolvePortrait()}
              sizes="(max-width: 480px) 130vw, (max-width: 768px) 55vw, 600px"
            />
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
      <section id="works" className="border-t border-line bg-surface-2">
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

          {/* トップは「選りすぐり」なので先頭4件だけ（2x2）。全件は /works へ誘導する。
              どれを出すかは works.ts の並び順で決まる = 見せたい順に並べ替えれば入れ替わる。 */}
          <div className="grid grid-cols-1 gap-[clamp(20px,3vw,40px)] md:grid-cols-2">
            {works.slice(0, 4).map((w) => (
              <Reveal key={w.slug} delayMs={w.delayMs}>
                <TransitionLink
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
                    <WorkShot slug={w.slug} image={w.image} />
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
                </TransitionLink>
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

        {/* 縦タイムライン：各フェーズはクリックで詳細モーダルを開く（ProcessTimeline）*/}
        <ProcessTimeline steps={processSteps} />
      </section>

      {/* ===== CONTACT ===== */}
      <section
        id="contact"
        className="border-t border-line bg-surface-2"
      >
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(72px,11vw,150px)] text-center">
          {/* PC（sm 以上）は inline で1行。狭い画面では block で2行に折り返す。
              1文字ずつ下からフェードイン。下の文章はこれが出終わってから出現させる。 */}
          <h2 className="mx-auto m-0 max-w-[22em] text-[clamp(24px,4vw,44px)] font-medium leading-[1.35] tracking-[-0.025em] sm:max-w-none">
            <HeadingChars phrases={["WEBのこと", "技術で頼れる人を探していますか。"]} />
          </h2>
          {/* 本文は区切らず1文で流す。狭い画面では中央揃えだと折り返しごとに行頭がずれ
              最終行の「ます。」だけが中央に浮くので ここだけ左揃えにする。
              PC では1行に収まりきるため 左揃えでも見た目は中央のまま変わらない。 */}
          <Reveal
            as="p"
            delayMs={1000}
            className="wrap-phrase mx-auto mt-[28px] max-w-[44em] text-left text-[15px] leading-[1.9] text-muted [text-wrap:pretty]"
          >
            制作会社や事業者の方からのご相談を歓迎します。Web制作・開発・機能実装まで対応します。
          </Reveal>
          {/* 安心材料：相談のハードルを下げる一言 */}
          <Reveal
            delayMs={1150}
            className="mt-[20px] flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-muted"
          >
            <span>お見積もりは無料</span>
            <span aria-hidden className="text-faint">/</span>
            <span>簡単な内容でもかまいません</span>
            <span aria-hidden className="text-faint">/</span>
            <span>返信は1〜2営業日が目安</span>
          </Reveal>
          {/* お問い合わせページ（フォーム）への誘導 */}
          <Reveal delayMs={1300} className="mt-[44px] flex flex-wrap justify-center gap-[14px]">
            <Link href="/contact" className={`${btnPrimary} px-[30px] py-[15px] text-[14.5px]`}>
              相談する<span className={btnArrow}>→</span>
            </Link>
            <Link href="/profile" className={`${btnSecondary} px-[30px] py-[15px] text-[14.5px]`}>
              プロフィールを見る
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
