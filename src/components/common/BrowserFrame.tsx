// ブラウザ風カード（上部にドット＋URL・下にスクリーンショット領域）。
// 一覧カードと詳細ページのヒーロー画像で共用する。
// 画像未用意の間は斜線プレースホルダー。親に `group` があるとホバーで微ズームする（一覧カード用）。
// 実画像がある場合は next/image で blur-up 表示（タスク3）。

import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";

// 斜線パターン＋不透明な下地(surface)。下地が無いと隙間が透けて、共有要素遷移で
// 移動元スナップショット(暗いスクリム等)が透過して黒い縞になる。docs/view-transitions.md 参照。
const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px),var(--surface)]";

export function BrowserFrame({
  url,
  ratio,
  label = "screenshot",
  image,
  sizes = "(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 560px",
  className = "",
  viewTransitionName,
}: {
  url: string;
  ratio: string;
  label?: string;
  image?: string;
  /** next/image の sizes。呼び出し側の実レイアウト幅に合わせて指定する */
  sizes?: string;
  className?: string;
  /** 共有要素遷移用。スクリーンショット領域に付与する一意名（例: work-shot-${slug}）。
   *  一覧カードと詳細ヒーローで同名にすると、対応ブラウザで連続変形する。
   *  非対応ブラウザは単に無視するため、常にHTMLへ出力してよい（プログレッシブエンハンスメント）。 */
  viewTransitionName?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow)] ${className}`}
    >
      {/* ブラウザのバー */}
      <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-3.5 py-[11px]">
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden className="h-[9px] w-[9px] rounded-full bg-line-strong" />
        ))}
        <span className="ml-2.5 truncate font-mono text-[10.5px] text-faint">{url}</span>
      </div>
      {/* スクリーンショット領域（aspect-ratio で高さ確保＝CLSゼロ）*/}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: ratio,
          // view-transition-class で質感(globals.css)を一括指定、name で一覧↔詳細を対応付け。
          ...(viewTransitionName ? { viewTransitionName, viewTransitionClass: "work-shot" } : null),
        }}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        ) : (
          <div
            className={`grid h-full w-full place-items-center ${hatch} transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none`}
          >
            <span className="font-mono text-[11px] tracking-[0.08em] text-faint">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
