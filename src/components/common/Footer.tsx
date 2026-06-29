import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-[clamp(20px,4vw,40px)] py-9">
        <span className="text-[13px] text-muted">シン｜WEB制作・コーディング</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="text-[12.5px] text-muted no-underline transition-colors hover:text-ink"
          >
            プライバシーポリシー
          </Link>
          <span className="font-mono text-[11px] tracking-[0.06em] text-faint">
            © 2026 — Next.js · Tailwind · Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}
