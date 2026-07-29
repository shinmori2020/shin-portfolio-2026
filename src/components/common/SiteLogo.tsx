import Link from "next/link";

/**
 * サイトロゴ。ヘッダーとフッターで共有する。
 *
 * 以前はフッターだけ和文の「シン｜WEB制作・コーディング」が残り
 * ヘッダーを英字へ変えた時に追従できていなかった。同じずれを防ぐため1箇所にまとめる。
 *
 * ロゴは英字で統一。サイト内のラベル（FRONTEND ENGINEER — 2026 / SELECTED WORKS — 08）や
 * ナビ（Works / Profile / Contact）がすべて英字のため 和文の「シン」だけが浮いていた。
 * 肩書きは「Web / Coding」より職種が明確な FRONTEND ENGINEER に揃える（ヒーローと同じ名乗り）。
 * tracking は和文向けの負値をやめ 欧文大文字が締まって見える正値にする。
 */
export function SiteLogo({ titleClassName = "" }: { titleClassName?: string }) {
  return (
    <Link href="/" className="flex items-baseline gap-[10px] text-ink no-underline">
      <span className="text-[16px] font-semibold tracking-[0.04em]">SHIN</span>
      <span
        className={`font-mono text-[16px] uppercase tracking-[0.06em] text-muted ${titleClassName}`}
      >
        Frontend Engineer
      </span>
    </Link>
  );
}
