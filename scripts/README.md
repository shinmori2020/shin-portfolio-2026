# scripts — Works 自動撮影

掲載サイトのサムネイル(ファーストビュー)を統一条件で自動撮影し
画像規約パス `public/works/{slug}/cover.png` へ保存する開発用スクリプト。

**ローカル手動実行のみ。** CI / Vercel ビルドでは実行しない（本体のランタイム・ビルド・
バンドル・依存には一切関与しない。`playwright` は devDependency で本体に import されない）。

## 初回セットアップ（1回だけ）

```bash
npm install                     # playwright(devDependency) を取得
npx playwright install chromium # 撮影用ブラウザ本体を取得
```

## 使い方

1. `scripts/capture-list.mjs` を開き 各案件の `slug` と実 `url` を記入する
   （初期値はダミー1件 `example.com`）。
2. 撮影を実行:

```bash
npm run capture                       # 全案件を撮影（既定で上書き=再撮影）
npm run capture -- --slug=headless-wp-media   # 1件だけ撮影
npm run capture -- --skip-existing    # 既に cover.* がある案件はスキップ
npm run capture -- --list             # 撮影せず対象一覧だけ表示
```

生成物: `public/works/{slug}/cover.png` → その場でサイトに反映される
（画像規約は `public/works/README.md` 参照。png は対応拡張子）。

## 撮影の統一条件（`capture-works.mjs` に固定・変更しない）

| 項目 | 値 |
|---|---|
| viewport | 1440 x 900 |
| deviceScaleFactor | 2（Retina 相当） |
| colorScheme | light 固定 |
| reduced-motion | reduce（登場アニメ途中を写さない） |
| 待機 | networkidle + `document.fonts.ready` + 500ms 安全マージン |
| タイムアウト | 1件 30 秒 |
| 出力 | `public/works/{slug}/cover.png`（既定で上書き） |

## capture-list.mjs のオプション項目（案件ごと・すべて任意）

| キー | 用途 |
|---|---|
| `dismiss` | 撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー等） |
| `waitMs` | 表示後の追加待機ミリ秒（遅延読み込みの重い案件用） |
| `fullPage` | `true` でページ全体を縦長撮影（既定 false = ファーストビューのみ） |

## 挙動

- 1件失敗しても止まらず続行。最後に成功/失敗の一覧（失敗 URL と理由）を表示する。
- 全件成功で終了コード 0 / 1件でも失敗があれば 1。

## 人間の確認事項（重要）

- **各サイトの掲載許可**、および画面内の**固有情報のマスク判断**（顧客名・個人情報・
  未公開情報など）は、撮影前に人間が確認する。スクリプトはマスクを行わない。
- ダミー案件(`_sample` / example.com)は動作確認用。確認後 `public/works/_sample/` は削除する。
