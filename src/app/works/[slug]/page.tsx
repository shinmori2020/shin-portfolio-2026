import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/common/Reveal";
import { TransitionLink } from "@/components/common/TransitionLink";
import { WorkImageLightbox } from "@/components/common/WorkImageLightbox";
import { JsonLd } from "@/components/common/JsonLd";
import { NumberedSection } from "@/components/common/NumberedSection";
import { works, getWorkBySlug } from "@/data/works";
import { resolveWorkCover, resolveWorkFull } from "@/lib/workImages";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  // 存在しない slug はページ側で notFound() を呼び 404 になる。
  // ただしメタ情報はこの関数の戻り値が優先され not-found.tsx の metadata は使われない。
  // ここで {} を返すとルートの既定タイトルが出て 他の404ページと表示が食い違うため揃える。
  if (!w) return { title: "ページが見つかりません", robots: { index: false, follow: false } };
  return {
    title: w.title,
    description: w.desc,
    alternates: { canonical: `/works/${w.slug}` },
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) notFound();

  const idx = works.findIndex((x) => x.slug === w.slug);
  const next = works[(idx + 1) % works.length];

  const metaItems: [string, string][] = [
    ["Client", w.meta.client],
    ["Role", w.meta.role],
    ["Year", w.meta.year],
    ["Type", w.meta.type],
  ];

  const hasOutcomes = !!(w.outcomes && w.outcomes.length > 0);
  const cover = resolveWorkCover(w.slug, w.image);
  const full = resolveWorkFull(w.slug, w.imageFull);

  return (
    <>
      {/* パンくずの構造化データ。検索結果で「制作物 › 作品名」の階層が出るようにする。
          画面上の「← Works」が実質のパンくずなので 表示は増やさない。 */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "制作物", item: absoluteUrl("/works") },
            { "@type": "ListItem", position: 3, name: w.title, item: absoluteUrl(`/works/${w.slug}`) },
          ],
        }}
      />
      {/* ===== DETAIL HERO ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(32px,4vw,48px)]">
        <Reveal priority className="mb-[clamp(32px,5vw,52px)]">
          <TransitionLink
            href="/works"
            className="link-underline group inline-flex items-center gap-2 text-[13px] text-muted no-underline transition-colors hover:text-accent"
          >
            <span aria-hidden className="font-mono transition-transform group-hover:-translate-x-[3px] motion-reduce:transform-none">
              ←
            </span>
            Works
          </TransitionLink>
        </Reveal>
        <Reveal priority className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.12em] text-accent">
          {w.no} — {w.kind}
        </Reveal>
        <Reveal priority
          as="h1"
          className="m-0 text-[clamp(28px,4.6vw,52px)] font-medium leading-[1.28] tracking-[-0.025em]"
        >
          {w.title}
        </Reveal>
        {w.href && (
          <Reveal priority delayMs={60} className="mt-[clamp(18px,2.4vw,26px)]">
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline group inline-flex items-center gap-2 text-[13.5px] text-accent no-underline transition-colors"
            >
              サイトを見る
              <span
                aria-hidden
                className="font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none"
              >
                →
              </span>
            </a>
          </Reveal>
        )}
        <Reveal priority
          delayMs={80}
          className="mt-[clamp(28px,4vw,44px)] flex flex-wrap gap-[clamp(24px,4vw,56px)] border-t border-line pt-[clamp(24px,3vw,32px)]"
        >
          {metaItems.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-[7px]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-faint">{k}</span>
              <span className="text-[14.5px]">{v}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ===== HERO IMAGE（クリックで全体をモーダル表示）===== */}
      {/* ファーストビューに入り LCP になるため 演出も JS を待たない CSS 側で出す */}
      <Reveal priority className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pb-[clamp(48px,7vw,88px)]">
        <WorkImageLightbox
          url={w.url}
          title={w.title}
          image={cover}
          imageFull={full}
          viewTransitionName={`work-shot-${w.slug}`}
        />
      </Reveal>

      {/* ===== BODY ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pb-[clamp(40px,6vw,72px)]">
        <NumberedSection no="01" title="制作物の概要">
          <p className="m-0 text-[15px] leading-[2.05] text-muted">{w.overview}</p>
        </NumberedSection>

        <NumberedSection no="02" title="解決した課題">
          <div className="flex flex-col gap-[18px]">
            {w.problems.map((p) => (
              <div key={p.k} className="flex items-start gap-4">
                <span className="mt-[3px] flex-none font-mono text-[12px] text-accent">{p.k}</span>
                <p className="m-0 text-[15px] leading-[1.95] text-muted">{p.v}</p>
              </div>
            ))}
          </div>
        </NumberedSection>

        <NumberedSection no="03" title="使用技術スタック">
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {w.stack.map((s) => (
              <li
                key={s.cat + s.name}
                className="rounded-full border border-line bg-surface px-4 py-1.5 text-[13.5px] text-ink"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection no="04" title="工夫した点・こだわり" last={!hasOutcomes}>
          <div className="flex flex-col gap-6">
            {w.craft.map((c) => (
              <div key={c.t} className="flex flex-col gap-2">
                <h3 className="m-0 text-[16px] font-semibold tracking-[-0.01em]">{c.t}</h3>
                <p className="m-0 text-[14.5px] leading-[1.95] text-muted">{c.d}</p>
              </div>
            ))}
          </div>
        </NumberedSection>

        {hasOutcomes && (
          <NumberedSection no="05" title="成果" last>
            <div className="flex flex-col gap-[clamp(20px,2.6vw,30px)]">
              {w.outcomes!.map((o, i) => (
                <div key={`${o.label}-${i}`} className="flex flex-col gap-[7px]">
                  <span className="text-[14px] font-medium tracking-[-0.005em] text-ink">{o.label}</span>
                  {(o.before || o.after) && (
                    <span className="font-mono text-[clamp(20px,2.7vw,28px)] font-medium tracking-[-0.01em] text-accent">
                      {o.before ? (
                        <>
                          {o.before}
                          <span aria-hidden className="mx-2.5 text-faint">
                            →
                          </span>
                          {o.after}
                        </>
                      ) : (
                        o.after
                      )}
                    </span>
                  )}
                  {o.note && <p className="m-0 text-[13.5px] leading-[1.9] text-muted">{o.note}</p>}
                </div>
              ))}
            </div>
          </NumberedSection>
        )}
      </section>

      {/* ===== NEXT WORK ===== */}
      <section className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(72px,10vw,120px)]">
        <Reveal>
          <TransitionLink
            href={`/works/${next.slug}`}
            className="group flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-[clamp(24px,3vw,36px)] text-ink no-underline transition-colors duration-200 motion-reduce:transition-none hover:border-accent focus-visible:border-accent focus-visible:outline-none"
          >
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
                Next work — {next.no}
              </span>
              <span className="text-[clamp(17px,2vw,21px)] font-semibold tracking-[-0.015em] transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent">
                {next.title}
              </span>
            </div>
            <span
              aria-hidden
              className="font-mono text-[22px] text-accent transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
            >
              →
            </span>
          </TransitionLink>
        </Reveal>
      </section>
    </>
  );
}
