// robots.txt（/robots.txt として配信される）。
//
// 静的なポートフォリオなので隠す領域は無い。全面的にクロールを許可し
// サイトマップの場所だけ知らせる。描画に必要なリソース(_next 配下の JS/CSS/画像)は
// 絶対に Disallow しないこと（レンダリングできずインデックスに悪影響が出る）。

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
