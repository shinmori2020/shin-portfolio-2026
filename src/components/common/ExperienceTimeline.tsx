"use client";

import { Reveal } from "./Reveal";
import { ScrollTimeline } from "./ScrollTimeline";
import type { TimelineEntry } from "@/data/profile";

// これまでの歩み（Experience）の縦タイムライン。
// スクロール進捗に追従して縦罫線が伸び 通過した点がアクセント緑へ灯る（ScrollTimeline）。
export function ExperienceTimeline({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <ScrollTimeline count={timeline.length} className="m-0 list-none p-0">
      {(lit) =>
        timeline.map((e, i) => (
          <Reveal
            as="li"
            key={e.year + e.title}
            delayMs={i * 80}
            className="group flex gap-[clamp(18px,3vw,28px)]"
          >
            {/* 左：ノード＋つなぎ線（進捗線は ScrollTimeline が重ねる）*/}
            <div className="flex flex-col items-center pt-[5px]">
              <span
                data-tl-dot
                className={`relative z-10 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                  i < lit ? "border-accent bg-accent" : "border-line bg-surface group-hover:border-accent"
                }`}
              >
                <span
                  className={`h-[9px] w-[9px] rounded-full transition-colors duration-200 ${
                    i < lit ? "bg-bg" : "bg-accent"
                  }`}
                />
              </span>
            </div>

            {/* 右：内容 */}
            <div className="flex-1 pb-[clamp(28px,5vw,52px)]">
              <span className="font-mono text-[13px] tracking-[0.04em] text-accent">{e.year}</span>
              <h3 className="m-0 mt-2 text-[clamp(17px,2vw,20px)] font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-accent">
                {e.title}
              </h3>
              <p className="m-0 mt-[10px] text-[14.5px] leading-[1.9] text-muted">{e.desc}</p>
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {e.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11.5px] tracking-[0.02em] text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))
      }
    </ScrollTimeline>
  );
}
