// 作品詳細の動的OG画像（案件タイトル入り）。generateStaticParams でビルド時に静的化される。
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { works, getWorkBySlug } from "@/data/works";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "シンの制作物";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  return renderOgImage({
    eyebrow: w ? `WORK — ${w.no}` : "WORK",
    title: w?.title ?? "制作物",
    subtitle: "シン — WEB制作・コーディング",
  });
}
