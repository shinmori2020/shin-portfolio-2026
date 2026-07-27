// ポートレートカード（角丸の枠＋軽いパララックス）。
// /profile と Home の About で共用する。比率だけが違うので ratio で受け取る。
//
// 画像は public/profile/portrait.* を置くだけで反映（src/lib/portraitImage.ts）。
// 未用意の間は斜線プレースホルダー。
//
// Reveal は呼び出し側で巻く（ページごとに delay と方向が違うため）。

import Image from "next/image";
import { Parallax } from "./Parallax";
import { BLUR_DATA_URL } from "@/lib/blur";

// 斜線パターン＋不透明な下地(surface)。works 側と同じ質感に揃える。
const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_12px,transparent_12px,transparent_24px),var(--surface)]";

export function Portrait({
  ratio,
  image,
  sizes,
}: {
  /** CSS の aspect-ratio（例: "4 / 5" / "1 / 1"）*/
  ratio: string;
  image?: string;
  /** next/image の sizes。呼び出し側の実レイアウト幅に合わせて指定する */
  sizes: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow)]">
      {/* aspect-ratio で高さを確保＝CLSゼロ */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        {/* 軽いパララックス。中身を大きめ(116%)に置いて 動いた時の端の隙間を防ぐ。 */}
        <Parallax range={16} className="absolute inset-x-0 -top-[8%] h-[116%]">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes={sizes}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          ) : (
            <div className={`h-full w-full ${hatch}`} />
          )}
        </Parallax>
        {!image && (
          <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.08em] text-faint">
            portrait
          </span>
        )}
      </div>
    </div>
  );
}
