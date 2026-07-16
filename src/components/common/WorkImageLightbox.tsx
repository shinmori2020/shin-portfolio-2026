"use client";

import { useState } from "react";
import { BrowserFrame } from "./BrowserFrame";
import { Modal } from "./Modal";

// 詳細ページのヒーロー画像。全景(full)がある時だけクリックで全体スクリーンショットをモーダル表示する。
// full が無い案件では「全体を見る」導線を出さず 静的なブラウザ枠のみ表示する（フォールバック思想）。
export function WorkImageLightbox({
  url,
  title,
  image,
  imageFull,
  viewTransitionName,
}: {
  url: string;
  title: string;
  image?: string;
  /** 縦長全景（full.png）。未指定なら「全体を見る」導線ごと非表示にする */
  imageFull?: string;
  /** 共有要素遷移用。一覧カードと同名にする（例: work-shot-${slug}）。 */
  viewTransitionName?: string;
}) {
  const [open, setOpen] = useState(false);

  // 全景が無ければライトボックスを配線せず 静的なヒーロー枠だけを出す
  if (!imageFull) {
    return (
      <BrowserFrame
        url={url}
        ratio="16 / 8.5"
        label="hero screenshot"
        image={image}
        sizes="(max-width: 1180px) 100vw, 1100px"
        viewTransitionName={viewTransitionName}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${title} の全体スクリーンショットを表示`}
        className="group relative block w-full cursor-zoom-in text-left"
      >
        <BrowserFrame
          url={url}
          ratio="16 / 8.5"
          label="hero screenshot"
          image={image}
          sizes="(max-width: 1180px) 100vw, 1100px"
          viewTransitionName={viewTransitionName}
        />
        {/* ホバー時のヒント */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none [background:color-mix(in_srgb,var(--ink)_82%,transparent)]"
        >
          全体を見る
          <span className="font-mono">⤢</span>
        </span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledById="work-image-title"
        panelMaxWidth="max-w-[1000px]"
        panelPadding="p-[clamp(14px,2.2vw,22px)]"
      >
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="work-image-title" className="m-0 truncate text-[14px] font-medium text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors duration-200 hover:border-accent"
            >
              <span aria-hidden className="text-[16px] leading-none">
                ×
              </span>
            </button>
          </div>

          {/* 全体スクリーンショット（縦長・パネル内スクロール）*/}
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="sticky top-0 flex items-center gap-1.5 border-b border-line bg-surface-2 px-3.5 py-[10px]">
              {[0, 1, 2].map((i) => (
                <span key={i} aria-hidden className="h-[9px] w-[9px] rounded-full bg-line-strong" />
              ))}
              <span className="ml-2.5 truncate font-mono text-[10.5px] text-faint">{url}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageFull} alt={`${title} の全体スクリーンショット`} className="block w-full" />
          </div>
        </div>
      </Modal>
    </>
  );
}
