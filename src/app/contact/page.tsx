import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Web制作・開発・機能実装のご依頼やご相談はこちらから。お見積もりは無料。簡単な内容でもお気軽にお送りください。",
};

const reassurance = ["お見積もりは無料", "簡単な内容でもかまいません", "返信は1〜2営業日が目安"];

export default function ContactPage() {
  return (
    <section className="border-t border-line bg-surface-2">
      <div className="mx-auto max-w-[1080px] px-[clamp(20px,4vw,40px)] py-[clamp(60px,9vw,120px)]">
        <div className="grid gap-[clamp(36px,6vw,72px)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
          {/* 左：イントロ（PCでは上部に固定して追従） */}
          <div className="lg:sticky lg:top-[112px] lg:self-start">
            <Reveal className="mb-[20px] font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
              Contact
            </Reveal>
            <Reveal
              as="h1"
              className="m-0 text-[clamp(28px,5vw,42px)] font-medium leading-[1.3] tracking-[-0.025em]"
            >
              お問い合わせ
            </Reveal>
            <Reveal
              as="p"
              delayMs={80}
              className="mt-[20px] max-w-[34em] text-[15px] leading-[1.95] text-muted [text-wrap:pretty]"
            >
              ご依頼やご相談はこちらのフォームからお送りください。Web制作・開発・機能実装まで対応します。
            </Reveal>
            <Reveal as="ul" delayMs={120} className="mt-[28px] space-y-[10px]">
              {reassurance.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-[13.5px] text-muted">
                  <span aria-hidden className="font-mono text-accent">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </Reveal>
            <Reveal delayMs={160} className="mt-[34px]">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-[13.5px] text-muted transition-colors hover:text-ink"
              >
                <span aria-hidden className="font-mono transition-transform group-hover:-translate-x-[3px]">
                  ←
                </span>
                トップへ戻る
              </Link>
            </Reveal>
          </div>

          {/* 右：フォームカード（環境変数未設定時はスタブ動作） */}
          <Reveal
            delayMs={120}
            from="up"
            className="rounded-2xl border border-line bg-surface p-[clamp(22px,4vw,38px)]"
          >
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
