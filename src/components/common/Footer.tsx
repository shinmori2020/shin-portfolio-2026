export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-[clamp(20px,4vw,40px)] py-9">
        <span className="text-[13px] text-muted">シン｜WEB制作・コーディング</span>
        <span className="font-mono text-[11px] tracking-[0.06em] text-faint">
          © 2026 — Next.js · Tailwind · Vercel
        </span>
      </div>
    </footer>
  );
}
