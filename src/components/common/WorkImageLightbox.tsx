"use client";

import { useState } from "react";
import { BrowserFrame } from "./BrowserFrame";
import { Modal } from "./Modal";

const hatch =
  "[background:repeating-linear-gradient(135deg,var(--surface-2),var(--surface-2)_14px,transparent_14px,transparent_28px)]";

// 詳細ページのヒーロー画像。クリックで全体スクリーンショットをモーダル（ライトボックス）表示する。
export function WorkImageLightbox({
  url,
  title,
  image,
  imageFull,
}: {
  url: string;
  title: string;
  image?: string;
  imageFull?: string;
}) {
  const [open, setOpen] = useState(false);
  const full = imageFull ?? image;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${title} の全体スクリーンショットを表示`}
        className="group relative block w-full cursor-zoom-in text-left"
      >
        <BrowserFrame url={url} ratio="16 / 8.5" label="hero screenshot" image={image} />
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
            {full ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={full} alt={`${title} の全体スクリーンショット`} className="block w-full" />
            ) : (
              <div
                className={`grid w-full place-items-center ${hatch}`}
                style={{ aspectRatio: "16 / 34" }}
              >
                <span className="font-mono text-[11px] tracking-[0.08em] text-faint">
                  full screenshot
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
