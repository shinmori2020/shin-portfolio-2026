"use client";

/**
 * ヒーロー右側の最新作カード（背景に溶け込む半透明の静かな導線）。
 * - コピー(relative z-10)より下の z-index に置き、重なったら文字が手前。
 * - コンテンツなので aria-hidden にはしない。
 * - 画像部は実画像未用意のため、他カード同様の斜線プレースホルダー。
 *   実スクリーンショット投入時は .hlw-shot-inner を next/image(fill + placeholder="blur")
 *   に差し替えるだけでよい（BrowserFrame と同じ blur-up 方式）。
 * - slug / title / url は最新作（works 先頭）から取得＝単一の情報源。
 * - スタイルは globals.css の .hero-latest / .hlw* 系とペア。
 */

import Image from "next/image";
import Link from "next/link";
import { works } from "@/data/works";
import { BLUR_DATA_URL } from "@/lib/blur";

// 実スクリーンショット投入前でも導線として表示する（HANDOFF上書き指示）。
const SHOW_LATEST_WORK = true;

// image は cover 規約をサーバ側で解決した結果を親(page.tsx)から受け取る。
// 未指定なら斜線プレースホルダーへ自動フォールバック。
export function LatestWorkCard({ image }: { image?: string }) {
  if (!SHOW_LATEST_WORK) return null;

  const work = works[0]; // 最新作（配列先頭）

  return (
    <div className="hero-latest">
      <Link href={`/works/${work.slug}`} className="hlw">
        <span className="hlw-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="hlw-url">{work.url}</span>
        </span>

        {/* cover があれば blur-up 表示。無ければ斜線プレースホルダーへ自動フォールバック */}
        <span className="hlw-shot">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="440px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="hlw-shot-img object-cover"
            />
          ) : (
            <span className="hlw-shot-inner" aria-hidden="true" />
          )}
        </span>

        <span className="hlw-cap">
          <span className="hlw-label">LATEST WORK</span>
          <span className="hlw-title">
            {work.title}
            <span className="hlw-arrow" aria-hidden="true">
              &#8594;
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}
