import Link from "next/link";
import { SiteLogo } from "./SiteLogo";

const footerLink =
  "link-underline text-[12.5px] text-muted no-underline transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line">
      {/* 狭い画面はロゴ / リンク / コピーライトの3段に積む。
          横並びのまま折り返させるとリンクとコピーライトが同じ行に混ざり
          どこまでが導線でどこからが表記なのか読み取りづらかった。
          sm 以上は従来どおり ロゴを左 それ以外を右へ寄せた1行に戻す。 */}
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-[clamp(20px,4vw,40px)] py-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-4">
        {/* ロゴはヘッダーと共有（SiteLogo）。フッターは単独の行になるため肩書きを畳まない */}
        <SiteLogo />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-x-6">
          {/* 技術資料はナビに入れず フッターから。主要導線（Works / Profile / Contact）を薄めない */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/tech" className={footerLink}>
              このサイトの技術
            </Link>
            <Link href="/privacy" className={footerLink}>
              プライバシーポリシー
            </Link>
          </div>
          <span className="font-mono text-[11px] tracking-[0.06em] text-faint">
            © 2026 — Next.js · Tailwind · Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
