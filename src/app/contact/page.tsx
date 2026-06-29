import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Web制作・開発・機能実装のご依頼やご相談はこちらから。お見積もりは無料。簡単な内容でもお気軽にお送りください。",
};

export default function ContactPage() {
  return (
    <section className="border-t border-line bg-surface-2">
      <div className="mx-auto max-w-[680px] px-[clamp(20px,4vw,40px)] py-[clamp(64px,10vw,128px)]">
        <Reveal className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
          Contact
        </Reveal>
        <Reveal
          as="h1"
          className="m-0 text-[clamp(28px,5vw,44px)] font-medium leading-[1.3] tracking-[-0.025em]"
        >
          お問い合わせ
        </Reveal>
        <Reveal
          as="p"
          delayMs={80}
          className="mt-[22px] max-w-[40em] text-[15px] leading-[1.95] text-muted [text-wrap:pretty]"
        >
          ご依頼やご相談はこちらのフォームからお送りください。
          <br className="hidden sm:block" />
          Web制作・開発・機能実装まで対応します。
        </Reveal>
        <Reveal
          delayMs={120}
          className="mt-[18px] flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted"
        >
          <span>お見積もりは無料</span>
          <span aria-hidden className="text-faint">/</span>
          <span>簡単な内容でもかまいません</span>
          <span aria-hidden className="text-faint">/</span>
          <span>返信は1〜2営業日が目安</span>
        </Reveal>

        {/* 問い合わせフォーム（Server Action + Resend。環境変数未設定時はスタブ動作） */}
        <Reveal delayMs={160} className="mt-[44px]">
          <ContactForm />
        </Reveal>

        <Reveal delayMs={200} className="mt-[40px] border-t border-line pt-[28px]">
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
    </section>
  );
}
