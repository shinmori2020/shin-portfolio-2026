# ポートフォリオサイト実装指示書（Claude Code 用）

このドキュメントは、Claude Design で作成したデザイン案を、Next.js + Tailwind CSS で本実装するための指示書です。`design-reference/` フォルダにある HTML（Claude Design からエクスポートしたもの）を「デザインの正」として参照しながら実装してください。

---

## 0. 前提・ゴール

- 目的：フリーランス（フロントエンドエンジニア「シン」）のポートフォリオサイトを制作する。狙うのは制作会社からの継続パートナー委託・モダン技術での開発案件。
- 方針：派手な演出より「洗練・引き算・速度」。余白とタイポグラフィで品を出す。表示速度を犠牲にする重い演出はしない。
- 最終的に Vercel にデプロイする。

---

## 1. 技術スタック

- Next.js（App Router）
- TypeScript
- Tailwind CSS
- Framer Motion（スクロール reveal とホバーの上品な動きに使用）
- コンテンツは CMS を使わず、データは TypeScript のオブジェクト/配列で直書き（`src/data/` に集約）
- ホスティング：Vercel

---

## 2. design-reference の読み方（重要）

`design-reference/` には Claude Design 製の HTML が入っています。これは独自記法を含むので、**そのまま使わず「デザインの設計図」として読み替えて**ください。

- `{{ theme }}` `{{ toggleTheme }}` `{{ themeIcon }}` … テーマ状態のバインディング。React の state（後述）に置き換える。
- `<sc-for list="{{ works }}" as="w">…</sc-for>` … 繰り返し記法。React の `.map()` に置き換える。ループ対象の実データは各ファイル末尾の `<script>` 内 `renderVals()` にすべて入っている（works / skills / timeline など）。これを `src/data/` に移植する。
- `style-hover="..."` … ホバー時のスタイル。Tailwind の `hover:` または Framer Motion の `whileHover` に置き換える。
- `data-reveal` / `data-reveal-delay="90"` … スクロールで «opacity 0→1・translateY 20px→0» のフェードイン。Framer Motion（`whileInView`）で実装。delay はミリ秒。
- ファイル末尾 `<script>` の `initReveal()` は、この reveal の挙動の仕様書として読む（threshold ≒ 0.08〜0.1、duration 0.75s、easing `cubic-bezier(.22,.61,.36,1)`）。
- インライン `style="..."` は Tailwind クラスへ整理する。clamp() を多用しているので、Tailwind の任意値（例 `text-[clamp(34px,6.4vw,76px)]`）や `clamp()` をそのまま使ってよい。

---

## 3. デザイントークン（CSS 変数）

design-reference 内に完全な定義がある。これを `globals.css` に `:root` と `[data-theme="dark"]` として移植し、Tailwind から参照する（`bg-[var(--bg)]` などの任意値、または theme 拡張）。

### ライト（既定）
```
--bg:#f4f3ef;  --surface:#ffffff;  --surface-2:#fbfaf6;
--ink:#191b18; --muted:#6b6e66;    --faint:#9b9d94;
--line:rgba(20,24,18,0.10);  --line-strong:rgba(20,24,18,0.20);
--accent:#214034; --accent-2:#2c5446; --accent-soft:#e7efe9;
--shadow:0 1px 2px rgba(20,30,20,.04), 0 14px 40px -18px rgba(20,30,20,.16);
```

### ダーク（`[data-theme="dark"]`）
```
--bg:#0d100e;  --surface:#141815;  --surface-2:#191e1a;
--ink:#edf0ea; --muted:#9aa09a;    --faint:#6c726b;
--line:rgba(255,255,255,0.10); --line-strong:rgba(255,255,255,0.18);
--accent:#74b491; --accent-2:#8cc6a6; --accent-soft:#19241e;
--shadow:0 1px 2px rgba(0,0,0,.4), 0 18px 50px -22px rgba(0,0,0,.7);
```

### フォント（Google Fonts）
- 英文：Geist（300/400/500/600）
- 等幅：Geist Mono（400/500）— ラベル・番号・URL・記号に使用
- 和文：Zen Kaku Gothic New（400/500/700）
- 本文 font-family は `'Geist','Zen Kaku Gothic New',sans-serif`、`font-feature-settings:'palt'` を全体に当てる。
- `next/font`（Geist は `geist` パッケージ、または next/font/google）で読み込み、CLS を防ぐ。

---

## 4. ページ構成（App Router）

design-reference のファイルと対応：

| ルート | 元ファイル | 内容 |
|---|---|---|
| `/` | `Home_dc.html`（A案・採用） | ヒーロー / 3領域 / 制作物ティーザー / Approach / Contact |
| `/works` | `Works_dc.html` | 制作物一覧（4作品） |
| `/works/[slug]` | `WorkDetail_dc.html` | 制作物詳細（テンプレを4作品分に展開） |
| `/profile` | `Profile_dc.html` | プロフィール / スキル / 経歴 / Contact |

- **A案（Home_dc.html＝余白主義）を採用する。** `HomeB_dc.html`（B案・構造的）は実装しない（参考としてのみ残す）。
- ヘッダー / フッターは全ページ共通なので、共通レイアウトコンポーネントに切り出す。
- ナビは Works / Profile / Contact。Contact は Home 内の `#contact` セクションへのアンカー。

---

## 5. データの集約（src/data/）

design-reference の `<script>` 内 `renderVals()` にある実データを、型付きで `src/data/` に移植する。

- `works.ts` … 4作品（no, slug, kind, title, desc, url, tags, さらに詳細ページ用に client/role/year/type/本文セクション）
- `profile.ts` … skills（3カテゴリ）, timeline（4件）
- 各作品の `slug` を決め、`/works/[slug]` で引けるようにする。

### 4作品（既存データ）
1. ヘッドレスWP構成のメディア＋コーポレートサイト（Headless WP / Next.js / Tailwind / Vercel）
2. 多言語対応のECサイト（Next.js / i18n / TypeScript / Vercel）
3. コーディング見積もりシミュレーター（React / TypeScript / Tool）
4. Web制作提案書ビルダー（Next.js / PDF / Tool）

---

## 6. インタラクション（Framer Motion）

design-reference の挙動を踏襲。やりすぎない。

- スクロール reveal：`whileInView={{opacity:1, y:0}}`、初期 `{opacity:0, y:20}`、`viewport={{once:true, margin:"-7%"}}`、`transition={{duration:0.75, ease:[.22,.61,.36,1], delay}}`。delay は data-reveal-delay の値（ms→秒）。
- カードホバー：`whileHover={{y:-6}}`、内部スクショは `scale:1.04`。
- ボタンホバー：`y:-2` ＋ 影、ボーダー色を accent に。
- テーマ切替ボタン：ホバーで `rotate:18deg`。
- すべて `prefers-reduced-motion` を尊重（Framer Motion の `useReducedMotion` で無効化）。

---

## 7. テーマ切替（ライト / ダーク）

- design-reference は `localStorage('shin-theme')` に保存し、`data-theme` を切り替える実装。これを踏襲。
- Next.js では `next-themes` を使うのが簡単（FOUC 対策込み）。または自前で `data-theme` を `<html>` に付与。
- 初期テーマはライト。アイコンは ☾ / ☀。

---

## 8. プレースホルダーの差し替え（要対応）

現状デザインはダミー。以下を差し替える前提で実装する（画像が無ければ綺麗なプレースホルダーのままでよいが、差し替えやすい構造にする）。

- 制作物のスクリーンショット（現在は斜線パターンの "screenshot" プレースホルダー）→ 4作品の実スクショに差し替えられるよう、`works.ts` に画像パスを持たせ `next/image` で表示。
- プロフィールの portrait（斜線プレースホルダー）→ 任意。
- Contact のメールアドレス `hello@example.com` → 実際のアドレスに。
- 各作品の `url`（example.com）→ 実際のデプロイ URL（nordic-works.vercel.app など）に。

---

## 9. 品質基準（公開前チェック）

`.claude/skills/` のスキルに沿って、以下を満たす：

- レスポンシブ（PC / スマホ）。design-reference は `clamp()` と `auto-fit/minmax` グリッドで組まれているので踏襲。
- アクセシビリティ：キーボードフォーカス可視、適切な見出し階層、`aria-label`、コントラスト。
- Core Web Vitals：画像最適化（next/image）、フォント最適化（next/font）、不要な JS を増やさない。ファーストビューは即表示。
- SEO：各ページの metadata（title, description, OGP）。Home の OGP は既存メタを踏襲。
- セマンティック HTML（header/nav/section/footer）。

---

## 10. 実装の順番（推奨）

1. Next.js + TypeScript + Tailwind + Framer Motion + next-themes をセットアップ
2. `globals.css` にデザイントークン（CSS変数 ライト/ダーク）を移植、フォント設定
3. 共通レイアウト（Header / Footer / テーマ切替）を実装
4. `src/data/`（works.ts, profile.ts）を整備
5. `/`（Home・A案）を実装
6. `/works`（一覧）を実装
7. `/works/[slug]`（詳細）を実装 ← テンプレを4作品分に展開
8. `/profile` を実装
9. reveal アニメーション・ホバーを Framer Motion で付与
10. レスポンシブ・アクセシビリティ・パフォーマンスを通しでチェック
11. プレースホルダー差し替え → Vercel デプロイ

---

## 注意：このリポジトリで「やらないこと」

- B案（HomeB）の実装。
- CMS / ヘッドレスWP 接続（このサイト自体はデータ直書き）。
- 重いローディング演出・過剰なパララックス・3D。
- design-reference の独自記法（sc-for, style-hover, {{ }}）をそのまま残すこと。必ず React/Tailwind/Framer Motion に置き換える。
