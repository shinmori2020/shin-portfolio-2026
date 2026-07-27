// XML サイトマップ（/sitemap.xml として配信される）。
// 作品を増やしても works.ts から自動で拾うため ここを触る必要はない。

import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // 全ページ同時に更新されるわけではないが 静的サイトのため個別の更新日は持たない。
  // lastModified を省くより ビルド日を入れておく方がクロールの手がかりになる。
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/works`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/profile`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    // プライバシーポリシーは検索流入を狙う対象ではないため優先度を下げる（除外はしない）
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const workPages: MetadataRoute.Sitemap = works.map((w) => ({
    url: `${SITE_URL}/works/${w.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticPages, ...workPages];
}
