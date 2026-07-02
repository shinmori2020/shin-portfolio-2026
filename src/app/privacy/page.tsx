import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/common/Reveal";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "シンのポートフォリオサイトにおける個人情報の取り扱いについて。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="m-0 text-[17px] font-medium text-ink">{title}</h2>
      <div className="mt-3 text-[14.5px] leading-[1.95] text-muted">{children}</div>
    </section>
  );
}

const listClass = "mt-2 list-disc space-y-1 pl-5 marker:text-faint";

export default function PrivacyPage() {
  return (
    <article className="border-t border-line bg-surface-2">
      <div className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,40px)] py-[clamp(60px,9vw,120px)]">
        <Reveal className="mb-[18px] font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
          Privacy
        </Reveal>
        <Reveal
          as="h1"
          className="m-0 text-[clamp(26px,4.5vw,40px)] font-medium leading-[1.3] tracking-[-0.025em]"
        >
          プライバシーポリシー
        </Reveal>
        <Reveal
          as="p"
          delayMs={80}
          className="mt-[22px] text-[14.5px] leading-[1.95] text-muted"
        >
          シン（以下「当方」といいます）はお客様の個人情報を適切に保護することを重要な責務と考え
          以下の方針に基づき個人情報を取り扱います。
        </Reveal>

        <Reveal delayMs={120}>
          <Section title="1. 取得する情報">
            <p className="m-0">当方はお問い合わせフォームを通じて次の情報を取得します。</p>
            <ul className={listClass}>
              <li>お名前</li>
              <li>メールアドレス</li>
              <li>会社名（任意）</li>
              <li>ご依頼の種類・ご予算・希望納期（任意）</li>
              <li>お問い合わせ内容</li>
            </ul>
          </Section>

          <Section title="2. 利用目的">
            <p className="m-0">取得した情報は次の目的で利用します。</p>
            <ul className={listClass}>
              <li>お問い合わせへの返信および対応のため</li>
              <li>ご依頼内容の確認やお見積もりのご案内のため</li>
              <li>上記に付随する連絡のため</li>
            </ul>
          </Section>

          <Section title="3. 個人情報の管理">
            <p className="m-0">
              当方は取得した個人情報を正確かつ最新の状態に保ち
              不正アクセスや紛失・漏えいを防ぐため適切に管理します。
            </p>
          </Section>

          <Section title="4. 第三者への提供">
            <p className="m-0">
              当方は法令に基づく場合を除き
              ご本人の同意なく個人情報を第三者に提供することはありません。
            </p>
          </Section>

          <Section title="5. 外部サービスの利用">
            <p className="m-0">
              当方はサービス運営のため次の外部サービスを利用します。
              これらのサービスにおける情報の取り扱いは各社のポリシーに従います。
            </p>
            <ul className={listClass}>
              <li>メール送信: Resend（Resend, Inc.）</li>
              <li>ホスティング: Vercel（Vercel, Inc.）</li>
            </ul>
          </Section>

          <Section title="6. 開示・訂正・削除の請求">
            <p className="m-0">
              ご本人から個人情報の開示・訂正・削除等のご請求があった場合は
              本人であることを確認のうえ速やかに対応します。
            </p>
          </Section>

          <Section title="7. Cookie等について">
            <p className="m-0">
              本サイトは表示テーマの保持のためにブラウザのローカルストレージを利用する場合があります。
              これにより個人を特定する情報を取得することはありません。
            </p>
          </Section>

          <Section title="8. 本ポリシーの変更">
            <p className="m-0">
              当方は必要に応じて本ポリシーを変更することがあります。
              変更後の内容は本ページに掲載した時点から効力を生じます。
            </p>
          </Section>

          <Section title="9. お問い合わせ窓口">
            <p className="m-0">
              本ポリシーに関するお問い合わせは
              <Link href="/contact" className="text-accent underline underline-offset-2">
                お問い合わせフォーム
              </Link>
              よりご連絡ください。
            </p>
          </Section>

          {/* TODO（シン）: 制定日と運営者情報を確定する */}
          <p className="mt-12 text-[13px] leading-[1.9] text-faint">
            制定日: 2026年6月29日
            <br />
            運営者: シン
          </p>
        </Reveal>

        <Reveal delayMs={160} className="mt-[40px] border-t border-line pt-[26px]">
          <Link
            href="/"
            className="link-underline group inline-flex items-center gap-2 text-[13.5px] text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden className="font-mono transition-transform group-hover:-translate-x-[3px]">
              ←
            </span>
            トップへ戻る
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
