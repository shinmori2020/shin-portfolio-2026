import type { ServiceIconId } from "@/data/services";

// 軽量なラインアイコン（stroke=currentColor で配色トークンに追従）。
// 装飾なので aria-hidden。サイズは呼び出し側の font-size / 親に依存しすぎないよう固定 24。
const paths: Record<ServiceIconId, React.ReactNode> = {
  // サイト制作（ブラウザ/レイアウト）
  site: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
      <path d="M3 9 H21" />
      <path d="M6 6.7 h0.01 M8.4 6.7 h0.01" />
    </>
  ),
  // モダンフロント開発（コード < >）
  code: (
    <>
      <path d="M9 8 L5 12 L9 16" />
      <path d="M15 8 L19 12 L15 16" />
    </>
  ),
  // AI実装（スパークル）
  ai: (
    <>
      <path d="M12 3 L13.4 9 L19 11 L13.4 13 L12 19 L10.6 13 L5 11 L10.6 9 Z" />
      <path d="M18.5 4.5 l0.5 1.6 1.6 0.5 -1.6 0.5 -0.5 1.6 -0.5 -1.6 -1.6 -0.5 1.6 -0.5 Z" />
    </>
  ),
  // 表示速度・パフォーマンス（稲妻）
  speed: <path d="M13 2 L4.5 13.5 H11 l-1 8.5 L19 10.5 H12 l1-8.5 Z" />,
  // アクセシビリティ・SEO（シールド＋チェック）
  quality: (
    <>
      <path d="M12 3 L19 6 V11 c0 4.6-3.1 7.2-7 9 -3.9-1.8-7-4.4-7-9 V6 Z" />
      <path d="M9 11.8 l2.1 2.1 4-4.2" />
    </>
  ),
  // 保守・運用サポート（吹き出し）
  support: (
    <>
      <path d="M4.5 5 h15 a1.5 1.5 0 0 1 1.5 1.5 v8 a1.5 1.5 0 0 1-1.5 1.5 H11 l-4 3.5 V16 H4.5 a1.5 1.5 0 0 1-1.5-1.5 v-8 A1.5 1.5 0 0 1 4.5 5 Z" />
      <path d="M8.5 10.5 h0.01 M12 10.5 h0.01 M15.5 10.5 h0.01" />
    </>
  ),
};

export function ServiceIcon({ id, className }: { id: ServiceIconId; className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[id]}
    </svg>
  );
}
