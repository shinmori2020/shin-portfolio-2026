"use client";

import { useEffect } from "react";
import Link from "next/link";

// 各ページの実行時エラーの受け皿。これが無いと Next.js の既定表示になり
// 白い画面に "Application error: a client-side exception has occurred" の一行だけが出る
// （ヘッダーもフッターも戻る導線も無い状態。実測で確認済み）。
//
// レイアウトはこの上に残るのでヘッダーとフッターは表示される。
// 見た目は 404 に揃え「行き止まりにしない」方針を同じにする。
//
// ここでは Reveal も Motion も使わない。演出側の不具合が原因でここへ来た場合
// 同じ仕組みに依存していると受け皿まで道連れになるため
// 素の HTML と CSS だけで組む。

const btnBase =
  "group inline-flex items-center gap-[10px] rounded-full px-[26px] py-[14px] text-[14px] tracking-[0.02em] no-underline transition-[border-color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none";
const btnArrow =
  "font-mono transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-[3px] motion-reduce:transform-none";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 詳細は画面に出さない。原因の追跡は Vercel のログ側で digest を照合する
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1180px] flex-col justify-center px-[clamp(20px,4vw,40px)] pt-[clamp(64px,11vw,148px)] pb-[clamp(48px,7vw,96px)]">
      <p className="m-0 mb-[clamp(24px,4vw,40px)] font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
        Error — 問題が発生しました
      </p>
      {/* 読み幅は絞らない。広い画面では1行に収まる（404 の見出しと同じ扱い）*/}
      <h1 className="wrap-phrase m-0 text-[clamp(28px,4.6vw,52px)] font-medium leading-[1.28] tracking-[-0.025em]">
        ページを表示できませんでした。
      </h1>
      <p className="wrap-phrase mt-[clamp(20px,3vw,32px)] max-w-[40em] text-[clamp(14px,1.4vw,17px)] leading-[1.9] text-muted">
        一時的な不具合の可能性があります。もう一度お試しください。
      </p>

      <div className="mt-[clamp(32px,5vw,48px)] flex flex-wrap gap-[14px]">
        {/* reset() は壊れた画面だけを描き直す。ページ全体の再読み込みより速い */}
        <button
          type="button"
          onClick={reset}
          className={`${btnBase} cursor-pointer border-0 bg-accent text-on-accent`}
        >
          もう一度試す<span className={btnArrow}>→</span>
        </button>
        <Link href="/" className={`${btnBase} border border-line-strong text-ink hover:border-accent`}>
          トップへ戻る
        </Link>
      </div>

      {/* 問い合わせを受けた時に照合できるよう エラーIDだけは控えめに出す */}
      {error.digest && (
        <p className="mt-[clamp(28px,4vw,40px)] m-0 font-mono text-[11.5px] tracking-[0.04em] text-faint">
          エラーID: {error.digest}
        </p>
      )}
    </section>
  );
}
