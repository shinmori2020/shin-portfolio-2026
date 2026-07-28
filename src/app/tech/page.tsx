import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { summary, techStack, decisions, cares, metrics, troubles, skipped } from "@/data/tech";

export const metadata: Metadata = {
  alternates: { canonical: "/tech" },
  title: "このサイトの技術",
  description:
    "このポートフォリオ自体の技術構成と設計判断の記録。Next.js 15 / TypeScript / Tailwind CSS v4 で構築し 表示速度とアクセシビリティに配慮した過程をまとめています。",
};

const REPO = "https://github.com/shinmori2020/shin-portfolio-2026";

// 本文の読み幅。1カラムでも1行が長くなりすぎないよう上限を設ける。
// 和文は1行あたり40〜50字が読みやすいとされるため 14px 前後で 46em を目安にする。
const READ_WIDTH = "max-w-[52em]";

// レイアウトは Home / Profile と同じ「見出しを上に積み 内容は全幅」の型。
// 左に見出し・右に内容の2カラム（作品詳細の型）は内容が短い前提のため
// 長文が続くこのページでは左が縦に間延びする。
//
// 内容は全セクション1カラムで縦に積む。項目ごとの文字数にばらつきがあり
// 多カラムだと段の高さが揃わず かえって空きが目立つため。
// 読みやすさのため本文の幅は READ_WIDTH で制限する（全幅だと1行が長くなりすぎる）。
// 単調さは背景の濃淡（1セクションおきに surface-2）と区切り罫線で補う。

function Section({
  label,
  title,
  tinted = false,
  children,
}: {
  label: string;
  title: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`border-t border-line${tinted ? " bg-surface-2" : ""}`}>
      <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(52px,7vw,96px)]">
        <Reveal className="mb-[clamp(28px,4vw,48px)]">
          <SectionHeading label={label}>{title}</SectionHeading>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

// 外部リンク（GitHub の記録へ飛ばす）。矢印だけ等幅にする流儀はサイト共通。
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline group inline-flex items-center gap-1.5 text-[13px] text-accent no-underline transition-colors"
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[11px] w-[11px] flex-none transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] motion-reduce:transform-none"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
      </svg>
    </a>
  );
}

export default function TechPage() {
  return (
    <>
      {/* ===== PAGE HEADER ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(56px,9vw,120px)] pb-[clamp(40px,6vw,72px)]">
        <Reveal priority className="mb-[24px] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          Tech &amp; Decisions
        </Reveal>
        <Reveal
          priority
          as="h1"
          className="m-0 text-[clamp(30px,5vw,56px)] font-medium leading-[1.2] tracking-[-0.025em]"
        >
          このサイトの技術と判断
        </Reveal>
        <Reveal
          priority
          as="p"
          delayMs={80}
          className={`mt-6 ${READ_WIDTH} text-[clamp(14px,1.4vw,17px)] leading-[1.95] text-muted [text-wrap:pretty]`}
        >
          このポートフォリオ自体も制作物です。企画・設計・実装・スクリーンショット撮影・文章まで
          すべて一人で担当しました。何を選び なぜそうしたか どこで詰まったかを記録しています。
        </Reveal>

        {/* サマリー行。作品詳細の CLIENT / ROLE / YEAR / TYPE と同じ様式で
            このサイト自身を1つの制作物として扱う。 */}
        <Reveal
          priority
          delayMs={140}
          className="mt-[clamp(28px,4vw,44px)] flex flex-wrap gap-[clamp(24px,4vw,56px)] border-t border-line pt-[clamp(24px,3vw,32px)]"
        >
          {summary.map((s) => (
            <div key={s.label} className="flex flex-col gap-[7px]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-faint">{s.label}</span>
              <span className="text-[clamp(16px,2vw,20px)] font-medium tracking-[-0.01em]">{s.value}</span>
              {s.sub && <span className="text-[12.5px] text-muted">{s.sub}</span>}
            </div>
          ))}
        </Reveal>

        <Reveal delayMs={200} className="mt-[clamp(20px,3vw,28px)]">
          <ExternalLink href={REPO}>ソースコードは GitHub で公開しています</ExternalLink>
        </Reveal>
      </section>

      {/* 01 技術構成 — 領域ラベルを左に固定幅で置き 右に内容（1行1項目） */}
      <Section label="01 / Stack" title="技術構成">
        <dl className={`m-0 flex flex-col ${READ_WIDTH}`}>
          {/* dl の直下に置けるのは dt / dd / div だけ。領域ラベルは dt の中に入れる
              （span を直に置くと HTML として不正になる） */}
          {techStack.map((t) => (
            <div
              key={t.cat}
              className="flex flex-col gap-[4px] border-t border-line py-[clamp(14px,1.8vw,18px)] sm:flex-row sm:gap-6"
            >
              <dt className="flex-none pt-[3px] sm:w-[104px]">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-faint">{t.cat}</span>
              </dt>
              <dd className="m-0 flex flex-col gap-[5px]">
                <span className="text-[15px] font-medium tracking-[-0.005em]">{t.name}</span>
                <span className="text-[13.5px] leading-[1.85] text-muted">{t.why}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={`mt-[clamp(22px,2.8vw,30px)] mb-0 ${READ_WIDTH} text-[13.5px] leading-[1.9] text-muted`}>
          データは管理画面（CMS）を使わず コード内に型付きで直接書いています。理由は次の 02 に書きます。
        </p>
      </Section>

      {/* 02 設計の判断 — 見出し＋本文を縦に積む */}
      <Section label="02 / Decisions" title="設計の判断" tinted>
        <div className={`flex flex-col ${READ_WIDTH}`}>
          {decisions.map((d) => (
            <Reveal
              key={d.title}
              className="flex flex-col gap-[10px] border-t border-line py-[clamp(20px,2.6vw,28px)]"
            >
              <h3 className="m-0 text-[16px] font-semibold leading-[1.6] tracking-[-0.01em]">{d.title}</h3>
              <p className="m-0 text-[14px] leading-[1.95] text-muted">{d.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 03 気を配ったこと — 観点ごとに縦に積む */}
      <Section label="03 / Care" title="特に気を配ったこと">
        <div className={`flex flex-col ${READ_WIDTH}`}>
          {cares.map((c) => (
            <Reveal
              key={c.label}
              className="flex flex-col gap-[12px] border-t border-line py-[clamp(20px,2.6vw,28px)]"
            >
              <h3 className="m-0 text-[15px] font-semibold tracking-[-0.01em] text-accent">{c.label}</h3>
              <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-[10px] text-[14px] leading-[1.9] text-muted">
                    <span aria-hidden className="mt-[9px] h-px w-3 flex-none bg-line-strong" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 04 数字 — 縦に積む。左に指標名 右に値（このページで最も目を引かせる場所） */}
      <Section label="04 / Metrics" title="計測した数字" tinted>
        <div className={`flex flex-col ${READ_WIDTH}`}>
          {metrics.map((m) => (
            <Reveal
              key={m.label}
              className="flex flex-col gap-[8px] border-t border-line py-[clamp(18px,2.4vw,24px)]"
            >
              <span className="text-[13.5px] font-medium tracking-[-0.005em] text-ink">{m.label}</span>
              <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                {m.before && (
                  <>
                    <span className="font-mono text-[13px] text-faint line-through decoration-1">{m.before}</span>
                    <span aria-hidden className="font-mono text-[12px] text-faint">
                      →
                    </span>
                  </>
                )}
                <span className="font-mono text-[clamp(19px,2.2vw,25px)] font-medium leading-[1.35] tracking-[-0.01em] text-accent">
                  {m.after}
                </span>
              </span>
              {m.note && <span className="text-[12.5px] leading-[1.8] text-muted">{m.note}</span>}
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 05 詰まった点 — 症状/原因/対処の3段。文章が長いため1カラムで読ませる */}
      <Section label="05 / Troubles" title="詰まった点と解決">
        <div className={`flex flex-col ${READ_WIDTH}`}>
          {troubles.map((t) => (
            <Reveal
              key={t.title}
              className="flex flex-col gap-[12px] border-t border-line py-[clamp(20px,2.6vw,28px)]"
            >
              <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em]">{t.title}</h3>
              <dl className="m-0 flex flex-col gap-[9px]">
                {(
                  [
                    ["症状", t.symptom],
                    ["原因", t.cause],
                    ["対処", t.fix],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex gap-[12px]">
                    <dt className="flex-none pt-[3px]">
                      <span className="font-mono text-[10.5px] tracking-[0.06em] text-accent">{k}</span>
                    </dt>
                    <dd className="m-0 text-[14px] leading-[1.9] text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
              {t.docHref && t.docLabel && (
                <div className="pl-[42px]">
                  <ExternalLink href={t.docHref}>検証の記録: {t.docLabel}</ExternalLink>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 06 やらなかったこと — 縦に積む */}
      <Section label="06 / Skipped" title="やらなかったこと" tinted>
        <p className={`m-0 mb-[clamp(18px,2.2vw,24px)] ${READ_WIDTH} text-[14px] leading-[1.9] text-muted`}>
          対応していない箇所と その理由です。気づいていないのではなく 判断した結果として残しています。
        </p>
        <div className={`flex flex-col ${READ_WIDTH}`}>
          {skipped.map((s) => (
            <Reveal
              key={s.title}
              className="flex flex-col gap-2 border-t border-line py-[clamp(20px,2.6vw,28px)]"
            >
              <h3 className="m-0 text-[15px] font-semibold leading-[1.6] tracking-[-0.01em]">{s.title}</h3>
              <p className="m-0 text-[14px] leading-[1.9] text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===== 記録への導線 ===== */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(52px,7vw,96px)]">
          <Reveal>
            <h2 className="m-0 text-[clamp(20px,2.6vw,28px)] font-medium leading-[1.4] tracking-[-0.02em]">
              判断の過程も残しています。
            </h2>
            <p className={`m-0 mt-4 ${READ_WIDTH} text-[14px] leading-[1.9] text-muted`}>
              約1か月の制作を10フェーズに整理した記録と 撮影や画面遷移で踏んだ落とし穴の検証メモを
              リポジトリに置いています。コミットは160件で いずれも何をなぜ変えたかを日本語で残しています。
            </p>
          </Reveal>
          <Reveal delayMs={80} className="mt-[clamp(20px,3vw,28px)] flex flex-wrap gap-x-7 gap-y-3">
            <ExternalLink href={`${REPO}/blob/main/docs/development-history.md`}>
              開発の記録（10フェーズ）
            </ExternalLink>
            <ExternalLink href={`${REPO}/blob/main/docs/works-capture.md`}>撮影の設計メモ</ExternalLink>
            <ExternalLink href={`${REPO}/blob/main/docs/view-transitions.md`}>画面遷移の設計メモ</ExternalLink>
          </Reveal>
          <Reveal delayMs={140} className="mt-[clamp(28px,4vw,40px)]">
            <Link
              href="/works"
              className="group inline-flex items-center gap-[10px] rounded-full border border-line-strong px-[26px] py-[13px] text-[14px] text-ink no-underline transition-colors duration-300 hover:border-accent"
            >
              制作物を見る
              <span
                aria-hidden
                className="font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
