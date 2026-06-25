import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: {
    default: "シン｜フロントエンドエンジニア",
    template: "%s｜シン",
  },
  description:
    "WordPress制作の現場を知る。Next.jsでモダンに作り直す。AI実装まで踏み込む。制作と開発の“あいだ”をつなぐフロントエンドエンジニア。",
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
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
