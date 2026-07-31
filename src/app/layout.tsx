import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ViewTransitions } from "@/components/common/ViewTransitions";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SITE_URL, SITE_NAME, SITE_DESC } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "シン — WEB制作・コーディング｜フロントエンドエンジニア",
    template: "%s | シン — WEB制作・コーディング",
  },
  description: SITE_DESC,
  // 自己参照 canonical。各ページで alternates.canonical を指定して上書きする
  // （ここに固定値を置くと全ページが同じURLを指してしまうため "/" は Home 専用ではない）。
  alternates: { canonical: "/" },
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
            {/* キーボードだけで操作する人が ヘッダーのナビを毎回タブで抜けずに
                本文へ飛べるようにする（WCAG 2.4.1 Bypass Blocks / Level A）。
                通常は画面外に置き Tab でフォーカスが来た時だけ現れるので見た目は変わらない。
                main の tabIndex={-1} は 飛んだ先へ実際にフォーカスを移すために必要
                （付けないとブラウザによってはスクロールするだけで読み上げ位置が動かない）。 */}
            <a href="#main" className="skip-link">
              本文へスキップ
            </a>
            <Header />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </ViewTransitions>
        </ThemeProvider>
      </body>
    </html>
  );
}
