import { Reveal } from "@/components/common/Reveal";

// このページは後続ステップで design-reference/Home.dc.html を忠実に実装する。
// 現段階はセットアップ・トークン・共通レイアウト・テーマ切替の確認用プレースホルダー。
export default function HomePage() {
  return (
    <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,11vw,148px)]">
      <Reveal
        as="div"
        className="mb-[clamp(28px,5vw,52px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent"
      >
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
        セットアップ・デザイントークン・共通レイアウト（Header / Footer /
        テーマ切替）の土台が整いました。Home 以降のページはこの基盤の上に実装していきます。
      </Reveal>
    </section>
  );
}
