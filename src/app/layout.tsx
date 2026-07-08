import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ViewTransitions } from "@/components/common/ViewTransitions";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shin-portfolio-2026.vercel.app";
const SITE_NAME = "シン — WEB制作・コーディング";
const SITE_DESC =
  "制作と開発の“あいだ”をつなぐフロントエンドエンジニア。WordPressの制作現場からNext.jsのモダン実装まで一貫して対応します。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "シン — WEB制作・コーディング｜フロントエンドエンジニア",
    template: "%s | シン — WEB制作・コーディング",
  },
  description: SITE_DESC,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    url: "/",
    title: "シン — WEB制作・コーディング｜フロントエンドエンジニア",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "シン — WEB制作・コーディング｜フロントエンドエンジニア",
    description: SITE_DESC,
  },
};

// theme-color はライト/ダークで切り替え（スマホブラウザのUI色をサイトに馴染ませる）
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d100e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={fontVariables}>
      <body>
        {/* design-reference 踏襲: data-theme 属性 / 既定ライト / shin-theme 保存。
            body の 0.4s クロスフェードを活かすため disableTransitionOnChange は付けない。 */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          storageKey="shin-theme"
        >
          <ViewTransitions>
            <Header />
            <main>{children}</main>
            <Footer />
          </ViewTransitions>
        </ThemeProvider>
      </body>
    </html>
  );
}
