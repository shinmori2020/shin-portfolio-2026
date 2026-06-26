"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ServiceIcon } from "./ServiceIcon";
import type { ServiceCard, ServiceTopic } from "@/data/services";

function Card({ card }: { card: ServiceCard }) {
  return (
    <div className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-[clamp(28px,3vw,40px)] transition-[border-color] duration-[400ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:border-accent">
      {/* PC: アイコン左＋タイトル右。スマホ: 左右中央の縦並び。 */}
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-4 md:text-left">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-110 motion-reduce:transform-none">
          <ServiceIcon id={card.icon} />
        </span>
        <h3 className="m-0 text-[clamp(19px,2.2vw,22px)] font-semibold tracking-[-0.01em]">{card.title}</h3>
      </div>
      {/* 2行分の高さを確保し、1行/2行でカード高さが変わらないようにする */}
      <p className="m-0 min-h-[3.7em] text-center text-[clamp(14px,1.5vw,15px)] leading-[1.85] text-muted md:text-left">
        {card.desc}
      </p>
      <ul className="m-0 mt-1 flex list-none flex-col gap-[10px] p-0 text-left">
        {card.points.map((pt) => (
          <li key={pt} className="flex items-start gap-[10px] text-[13px] leading-[1.7] text-muted">
            <span aria-hidden className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent" />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  defaultCards: ServiceCard[];
  topics: ServiceTopic[];
}

const GRID = "grid grid-cols-1 gap-[clamp(16px,2vw,24px)] md:grid-cols-2";

const pillClass = (on: boolean) =>
  `inline-flex cursor-pointer items-center gap-2 rounded-full border px-[14px] py-[8px] text-[13px] transition-[border-color,background-color,color] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
    on ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:border-accent"
  }`;

// 下のピルで上の2カードを切り替える。アクティブなピルを再度押すと既定（制作/開発）に戻る。
export function ServicesSwitcher({ defaultCards, topics }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const current = active ? topics.find((t) => t.key === active) : null;
  const cards = current ? current.cards : defaultCards;
  const viewKey = active ?? "default";

  return (
    <div>
      {/* カード表示エリア（ピルで切り替え）*/}
      <div className="mt-[clamp(32px,5vw,56px)]">
        {reduceMotion ? (
          <div className={GRID}>
            {cards.map((c) => (
              <Card key={c.title} card={c} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewKey}
              className={GRID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {cards.map((c) => (
                <Card key={c.title} card={c} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 切り替えピル（先頭は既定の制作・開発に戻るボタン）*/}
      <div className="mt-[clamp(28px,4vw,40px)]">
        <p className="m-0 text-[12px] tracking-[0.04em] text-faint">
          分野で切り替える（押すと上のカードが変わります）
        </p>
        <div className="mt-4 flex flex-wrap gap-[10px]">
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={pillClass(active === null)}
          >
            制作・開発
          </button>
          {topics.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={active === t.key}
              onClick={() => setActive(t.key)}
              className={pillClass(active === t.key)}
            >
              <ServiceIcon id={t.icon} className="h-4 w-4 text-accent" />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
