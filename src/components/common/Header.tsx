import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/profile", label: "Profile" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line backdrop-blur-[12px] backdrop-saturate-[1.6] [background:color-mix(in_srgb,var(--bg)_80%,transparent)]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-[clamp(20px,4vw,40px)] py-4">
        <Link
          href="/"
          className="flex items-baseline gap-[10px] text-ink no-underline"
        >
          <span className="text-[16px] font-semibold tracking-[-0.01em]">シン</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted">
            Web / Coding
          </span>
        </Link>

        <nav className="flex items-center gap-[clamp(16px,2.4vw,30px)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[13.5px] tracking-[0.02em] text-muted no-underline transition-colors duration-[250ms] after:absolute after:-bottom-[3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(.22,.61,.36,1)] hover:text-ink hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
