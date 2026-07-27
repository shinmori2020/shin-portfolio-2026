# 残タスク

公開までに片付ける作業の一覧。`finishing-package/ROADMAP.md`（仕上げ4件の統合指示書）が
全件消化されたため、その残作業の記録をここへ引き継いだ。

完了したら該当行を消す。全部消えたらこのファイルも消してよい。

---

## 人間（シン）にしかできないもの

### 1. Resend の本番設定 — **公開前必須**

Vercel のプロジェクト設定に環境変数を登録する。

| 変数 | 内容 |
|---|---|
| `RESEND_API_KEY` | Resend の API キー（Sensitive: ON 推奨） |
| `CONTACT_EMAIL_TO` | 通知の宛先。独自ドメイン未登録の間は Resend アカウントの登録アドレスと同じである必要がある |
| `CONTACT_EMAIL_FROM` | 任意。未設定なら `onboarding@resend.dev` で送る。自ドメインを設定すると問い合わせ者への自動返信も有効になる |

**未設定のままだと問い合わせが1件も届かない。** フォームはスタブ動作になり、
訪問者には「送信を受け付けました（現在はテスト動作）」と表示される。
公開前に必ずテスト送信して受信を確認すること。詳細は `.env.example`。

### 2. ポートレート画像 — 任意

`public/profile/portrait.webp` に置くだけで `/profile` とトップの About に反映される。
**1200px 角以上の正方形**を推奨（2箇所で比率が違うため）。
未用意の間は斜線プレースホルダーが出るだけで壊れない。規約は `public/profile/README.md`。

### 3. 成果データ（outcomes） — 任意

`src/data/works.ts` の各作品に `outcomes` を書くと、詳細ページの「05 成果」が表示される。
**現在は全8件とも未入力**で、未入力の間はセクションごと非表示になる。
書き方の記入例は works.ts 内のコメントを参照（数値改善は before→after /
単発の実測値は after のみ / 定性成果は label+note）。

### 4. Gradientr の技術構成の確認 — 小

`src/data/works.ts` の `gradientr` は **React + Vite** と記載しているが、これは推測。
公開ページの HTML が `<div id="root">` と Vite のビルド成果物だったことから判断した。
実際が違えば `stack` と `tags` を直す。

---

## 実装側で片付けるもの

### 5. 公開前チェック

`.claude/skills/` の4スキルに沿って通しで監査する。

- `core-web-vitals` … LCP / INP / CLS、画像・フォント最適化
- `accessibility` … キーボード操作、フォーカス可視、見出し階層、コントラスト
- `seo` … metadata、OGP、構造化データ、**`sitemap.ts` と `robots.ts` が未設置**
- `web-quality-audit` … 総合

**実測系（LCP など）は上記2のポートレート画像が入ってから。** `/profile` のファーストビューに
入る画像なので、無い状態で測っても本番の数値にならない。
構造・設定系（sitemap / robots / 見出し階層 / フォーカス管理）は画像に左右されないため先行してよい。

---

## 完了済みの記録

`finishing-package/ROADMAP.md` にあった8件はすべて消化した。

| 作業 | 状態 |
|---|---|
| hero-final / timeline-scroll | 完了 |
| 01-works-content（成果欄の実装と実画像の受け入れ準備） | 完了（成果データの記入だけ上記3に残る） |
| 実スクリーンショット撮影 | 完了。8件分を撮影し WebP 化。踏んだ罠は `docs/works-capture.md` |
| view-transitions（共有要素遷移） | 完了。設計メモは `docs/view-transitions.md` |
| 02-site-meta（OGP / favicon / theme-color） | 完了 |
| 03-not-found（404） | 完了 |
| 04-microcopy（UI文言の棚卸しと磨き込み） | 完了 |
| Resend 接続（実装） | 完了。本番の環境変数設定だけ上記1に残る |

---

## サイトの規約（作業時に守るもの）

- 文体: **読点「、」を使わない**（UI 文言）。半角スペースまたは文の分割で処理する
- 優先順位: 速度（LCP/INP/CLS） > 既存機能の無事 > 世界観（引き算） > 見た目の忠実度
- 完了条件: `tsc --noEmit` / `next lint` / `next build` の通過
