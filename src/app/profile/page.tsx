import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { DrawLine } from "@/components/common/DrawLine";
import { Parallax } from "@/components/common/Parallax";
import { HeadingChars } from "@/components/common/HeadingChars";
import { ServiceIcon } from "@/components/common/ServiceIcon";
import { ExperienceTimeline } from "@/components/common/ExperienceTimeline";
import { profile, skillGroups, timeline, values } from "@/data/profile";

export const metadata: Metadata = {
  title: "プロフィール",
  description:
    "シン｜フロントエンドエンジニアのプロフィール。WordPress制作の実務から Next.js によるモダンフロント開発まで。使用技術・得意領域とこれまでの歩み。",
};

const btnBase =
  "group inline-flex items-center gap-[10px] rounded-full px-[30px] py-[15px] text-[14.5px] no-underline transition-[border-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none";
const btnArrow =
  "font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none";

const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px)]";

// セクション見出し（ラベルを上・タイトルを下に縦積み）。Home と同じ構成・サイズで統一。
function SectionHeading({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-mono text-[12px] tracking-[0.1em] text-faint">{label}</span>
      <DrawLine className="mt-[14px] w-10" />
      <h2 className="mt-[14px] text-[clamp(22px,3vw,34px)] font-medium leading-[1.4] tracking-[-0.02em]">
        {children}
      </h2>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      {/* ===== INTRO（Home の About と同じ二段組）===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,148px)] pb-[clamp(48px,7vw,96px)]">
        <Reveal className="mb-[clamp(28px,5vw,52px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          Profile
        </Reveal>
        <div className="flex flex-wrap gap-[clamp(32px,6vw,80px)]">
          {/* ポートレート（左配置・正方形。未用意なら斜線プレースホルダー）*/}
          <Reveal className="flex flex-[1_1_260px]">
            <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
              <div className="relative aspect-square w-full overflow-hidden">
                <Parallax range={16} className="absolute inset-x-0 -top-[8%] h-[116%]">
                  <div className={`h-full w-full ${hatch}`} />
                </Parallax>
                <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.08em] text-faint">
                  portrait
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={90} className="flex flex-[1.4_1_360px] flex-col">
            <h1 className="m-0 text-[clamp(30px,5vw,56px)] font-medium leading-[1.2] tracking-[-0.025em]">
              {profile.name}
            </h1>
            <p className="m-0 mt-[16px] font-mono text-[15px] tracking-[0.02em] text-accent">
              {profile.role}
            </p>
            <p className="mt-[clamp(20px,3vw,28px)] text-[clamp(15px,1.5vw,17px)] leading-[1.95] text-muted">
              {profile.bio}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== 01 / SKILLS ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="mb-[clamp(32px,5vw,52px)]">
            <SectionHeading label="01 / Skills">得意なことと使う技術</SectionHeading>
          </Reveal>
          <div className="flex flex-col gap-[clamp(14px,2vw,18px)]">
            {skillGroups.map((g, i) => (
              <Reveal
                key={g.cat}
                delayMs={i * 90}
                className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-[clamp(22px,3vw,32px)] transition-colors duration-300 hover:border-line-strong"
              >
                {/* 上：アイコン＋見出し＋説明 */}
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent"
                  >
                    <ServiceIcon id={g.icon} />
                  </span>
                  <div>
                    <h3 className="m-0 text-[17px] font-semibold tracking-[-0.01em]">{g.cat}</h3>
                    <p className="m-0 mt-2 text-[13.5px] leading-[1.8] text-muted">{g.desc}</p>
                  </div>
                </div>
                {/* 下：スキルタグ */}
                <ul className="flex list-none flex-wrap gap-2 p-0">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-surface-2 px-3 py-1 text-[12.5px] text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATEMENT（控えめなスタンス文。中間トーン＋微かな斜め地紋）===== */}
      <section
        className="relative overflow-hidden border-t border-line"
        style={{ background: "color-mix(in srgb, var(--accent) 22%, var(--bg))" }}
      >
        {/* 特殊な背景：ごく薄い斜めストライプの地紋 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(135deg,transparent,transparent_24px,color-mix(in_srgb,var(--accent)_9%,transparent)_24px,color-mix(in_srgb,var(--accent)_9%,transparent)_25px)]"
        />
        <div className="relative mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,104px)]">
          <Reveal className="mb-[clamp(18px,2.5vw,28px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            Approach
          </Reveal>
          <Reveal
            as="p"
            delayMs={80}
            className="m-0 text-[clamp(18px,2.5vw,29px)] font-medium leading-[1.65] tracking-[-0.01em] text-ink"
          >
            制作と開発のあいだで 派手さよりも読みやすさと速さを大切にしています。発注する側が安心して任せられる状態を 丁寧に整えることを心がけています。
          </Reveal>
        </div>
      </section>

      {/* ===== 02 / EXPERIENCE ===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="mb-[clamp(36px,5vw,56px)]">
            <SectionHeading label="02 / Experience">これまでの歩み</SectionHeading>
          </Reveal>
          <ExperienceTimeline timeline={timeline} />
        </div>
      </section>

      {/* ===== 03 / VALUES（大切にしていること）===== */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,9vw,120px)]">
          <Reveal className="mb-[clamp(32px,5vw,52px)]">
            <SectionHeading label="03 / Values">大切にしていること</SectionHeading>
          </Reveal>
          <div className="flex flex-col border-b border-line">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delayMs={i * 80}
                className="flex items-center gap-[clamp(16px,4vw,48px)] border-t border-line py-[clamp(26px,3.5vw,44px)]"
              >
                <span
                  aria-hidden
                  className="w-[clamp(50px,7vw,104px)] shrink-0 font-mono text-[clamp(38px,6vw,80px)] font-medium leading-[0.9] tracking-[-0.03em] text-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]"
                >
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="m-0 text-[clamp(18px,2.2vw,24px)] font-semibold tracking-[-0.01em]">
                    {v.title}
                  </h3>
                  <p className="m-0 mt-3 text-[14.5px] leading-[1.9] text-muted">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA（TOP と同じ見せ方）===== */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,10vw,140px)] text-center">
          <h2 className="mx-auto m-0 max-w-[22em] text-[clamp(26px,4.4vw,48px)] font-medium leading-[1.32] tracking-[-0.025em] sm:max-w-none">
            <HeadingChars phrases={["お仕事のご相談", "お待ちしています。"]} />
          </h2>
          <Reveal
            as="p"
            delayMs={1000}
            className="mx-auto m-0 mt-[26px] max-w-[46ch] text-[15px] leading-[1.9] text-muted"
          >
            制作会社や事業者からのご相談を歓迎します。モダン技術での開発や機能実装などお気軽にご連絡ください。
          </Reveal>
          <Reveal delayMs={1200} className="mt-[42px] flex flex-wrap justify-center gap-[14px]">
            <Link href="/contact" className={`${btnBase} bg-accent text-white`}>
              お問い合わせへ <span className={btnArrow}>→</span>
            </Link>
            <Link
              href="/#works"
              className={`${btnBase} border border-line-strong text-ink hover:border-accent`}
            >
              制作物を見る
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
