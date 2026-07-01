// ブラウザ風カード（上部にドット＋URL・下にスクリーンショット領域）。
// 一覧カードと詳細ページのヒーロー画像で共用する。
// 画像未用意の間は斜線プレースホルダー。親に `group` があるとホバーで微ズームする（一覧カード用）。

const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px)]";

export function BrowserFrame({
  url,
  ratio,
  label = "screenshot",
  image,
  className = "",
}: {
  url: string;
  ratio: string;
  label?: string;
  image?: string;
  className?: string;
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
      {/* スクリーンショット領域 */}
      <div className="overflow-hidden" style={{ aspectRatio: ratio }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
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
