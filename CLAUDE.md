# CLAUDE.md

このファイルは Claude Code がこのプロジェクトで作業する際、常に参照する規約とガイドです。

## プロジェクト概要

フリーランスのフロントエンドエンジニア「シン」のポートフォリオサイト。狙うのは制作会社からの継続パートナー委託・モダン技術での開発案件。方針は「派手な演出より、洗練・引き算・速度」。余白とタイポグラフィで品を出し、表示速度を犠牲にする重い演出はしない。

詳細な実装仕様は **`IMPLEMENTATION_BRIEF.md` を必ず最初に読むこと。** デザインの正は `design-reference/`（Claude Design からエクスポートした HTML）にある。

## 技術スタック

- Next.js（App Router）/ TypeScript / Tailwind CSS / Framer Motion / Vercel
- データは CMS を使わず `src/data/` に TypeScript で直書き
- テーマ切替（ライト/ダーク）は next-themes 推奨

## スキルの使い方（重要）

`.claude/skills/` に、このプロジェクトで使うスキルが入っている。**該当する作業に入る前に、対応するスキルの SKILL.md を必ず読んでから着手すること。** 記憶や思い込みで進めず、スキルの内容を正とする。

| 作業内容 | 読むスキル |
|---|---|
| UI設計・コンポーネントの見た目・デザイン実装全般 | `frontend-design` |
| Tailwind の設定、ダークモード、アニメーション（reveal/ホバー） | `tailwind-v4-darkmode-motion` |
| UIの細部・コンポーネント設計 | `ui-designer` |
| 画面の情報設計・レイアウト構成（特に詳細ページ） | `interface-design` |
| 問い合わせフォームをメールリンクから実装フォームにする場合 | `resend-react-email-form` |
| 表示速度・パフォーマンス最適化、公開前チェック | `core-web-vitals` |
| アクセシビリティ対応（フォーカス、コントラスト、見出し階層） | `accessibility` |
| メタ情報・OGP・構造化などSEO設定 | `seo` |
| 実装全般のベストプラクティス確認 | `best-practices` |
| 公開前の総合品質監査 | `web-quality-audit` |
| サイト構築の補助 | `web-design-builder` |

### スキル参照のルール
- 複数のスキルが同時に該当することがある（例：Home実装時は frontend-design + tailwind-v4-darkmode-motion + accessibility）。該当するものはすべて読む。
- スキル名から内容が自明に見えても、思い込みで進めず SKILL.md を開いて確認する。環境固有の制約が書かれていることがある。
- 公開前は必ず core-web-vitals / accessibility / seo / web-quality-audit を通しで確認する。

## デザインの厳守事項（IMPLEMENTATION_BRIEF.md より要点）

- A案（`design-reference/Home.dc.html`）を採用。B案（HomeB）は実装しない。
- デザイントークン（CSS変数 ライト/ダークの全色、フォント Geist / Geist Mono / Zen Kaku Gothic New）は design-reference の定義をそのまま移植する。
- Claude Design 独自記法は必ず置き換える：`sc-for`→`.map()`、`style-hover`→Tailwind `hover:`、`data-reveal`→Framer Motion `whileInView`、`{{ }}`→React state。独自記法を残さない。
- reveal アニメーション：初期 `{opacity:0, y:20}` → `{opacity:1, y:0}`、duration 0.75s、ease `[.22,.61,.36,1]`、delay は data-reveal-delay（ms）。
- `prefers-reduced-motion` を尊重する。
- レスポンシブは clamp() と auto-fit/minmax グリッドで（design-reference 踏襲）。

## やらないこと

- B案の実装
- CMS / ヘッドレスWP 接続（このサイト自体はデータ直書き）
- 重いローディング演出・過剰なパララックス・3D
- design-reference の独自記法をそのまま残すこと

## ページ構成

| ルート | 元ファイル |
|---|---|
| `/` | design-reference/Home.dc.html（A案） |
| `/works` | design-reference/Works.dc.html |
| `/works/[slug]` | design-reference/WorkDetail.dc.html（4作品分に展開） |
| `/profile` | design-reference/Profile.dc.html |

## 未確定・人間（シン）が用意するもの

以下はプレースホルダー。実装は差し替えやすい構造にし、値の用意は人間に委ねる：
- 各作品のスクリーンショット画像
- 各作品詳細ページ（WorkDetail）の本文（課題・技術・AIと手作業の線引き・工夫点）
- Contact のメールアドレス（現状 hello@example.com）
- 各作品の実URL（現状 example.com）

## ハンドオフ作業のルール
- リポジトリ内の `*-handoff/` フォルダは設計済みコード。HANDOFF.md に従い再発明しない
- HANDOFF.md がある作業は方針確認を省略し 実装→セルフ検証→報告まで一括で行う
- 迷ったら作業を止めず 暫定判断で進めて報告の「判断した事項」に記載する
- 完了報告は HANDOFF.md 指定のフォーマットに従う