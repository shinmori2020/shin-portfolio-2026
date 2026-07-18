# scripts — Works 自動撮影

掲載サイトのスクリーンショットを統一条件で自動撮影し 画像規約パス
`public/works/{slug}/cover`(ファーストビュー) と `full`(縦長全景) へ保存する開発用スクリプト。

| スクリプト | 役割 |
|---|---|
| `capture-works.mjs` | 撮影（PNG で出力） |
| `to-webp.mjs` | 撮影後の WebP 変換（配信するのはこちら） |

設計判断と踏んだ落とし穴は `docs/works-capture.md` にまとめてある。

**ローカル手動実行のみ。** CI / Vercel ビルドでは実行しない（本体のランタイム・ビルド・
バンドル・依存には一切関与しない。`playwright` は devDependency で本体に import されない）。

## 初回セットアップ（1回だけ）

```bash
npm install                     # playwright(devDependency) を取得
npx playwright install chromium # 撮影用ブラウザ本体を取得
```

## 使い方

1. `scripts/capture-list.mjs` を開き 各案件の `slug` と実 `url` を記入する。
   cover(ファーストビュー) と full(縦長全景) は別ターゲットとして slug ごとに2件並べる。
2. 撮影を実行:

```bash
npm run capture                                  # 全ターゲットを撮影（既定で上書き=再撮影）
node scripts/capture-works.mjs --skip-existing   # 既に出力がある分はスキップし 無い分だけ撮影
node scripts/capture-works.mjs --slug=headless-wp-media  # 1案件だけ（cover/full 両方）
node scripts/capture-works.mjs --list            # 撮影せず対象一覧だけ表示
```

> **フラグを付ける時は `npm run` ではなく node を直接叩くこと。**
> この環境の npm は `npm run capture -- --skip-existing` のようなフラグをスクリプトへ渡さず
> 黙って**全件再撮影**になる（承認済み画像を上書きする事故につながる）。フラグ無しの
> `npm run capture` は問題ない。詳細は `docs/works-capture.md`。

`--skip-existing` の存在判定は cover 固定ではなく**ターゲットの `out` 単位**で行う。
cover があり full が無い時は cover をスキップして full だけ撮る という運用ができる。

生成物: `public/works/{slug}/cover.png` `full.png` → その場でサイトに反映される
（画像規約は `public/works/README.md` 参照。png は対応拡張子）。

3. 目視確認したら **WebP へ変換する**（撮影と変換は別工程）:

```bash
node scripts/to-webp.mjs              # 変換のみ（PNG を残し画質を比較したい時）
node scripts/to-webp.mjs --delete-png # 変換後に元 PNG を削除（通常はこちら）
node scripts/to-webp.mjs --dry-run    # 変換せず対象と現在のサイズだけ表示
```

画像規約は `webp` を最優先で探索するため **置き換えるだけでコード変更は不要**。
実績は8枚合計 14,685 KB → 1,868 KB（-87.3%）。**PNG は残さない**（webp が優先され
永遠に未使用になるため）。再撮影したら変換もやり直すこと。

## 撮影の統一条件（`capture-works.mjs` に固定・変更しない）

| 項目 | 値 |
|---|---|
| viewport | 1440 x 900 |
| deviceScaleFactor | 2（Retina 相当） |
| colorScheme | light 固定 |
| reduced-motion | reduce（登場アニメ途中を写さない） |
| 待機 | networkidle + `document.fonts.ready` + 500ms 安全マージン |
| タイムアウト | 1件 30 秒 |
| 出力 | `public/works/{slug}/{out}`（既定 `cover.png`・既定で上書き） |

`fullPage: true` の時だけ、撮影前に全体スクロール（遅延読み込みと reveal の発火）と
画面外で隠れ直した reveal の確定処理が入る。理由は `docs/works-capture.md` 参照。

## capture-list.mjs のオプション項目（案件ごと・すべて任意）

| キー | 用途 |
|---|---|
| `out` | 出力ファイル名（既定 `cover.png`）。縦長全景は `full.png` を指定する |
| `dismiss` | 撮影前にクリックして閉じる要素の CSS セレクタ（Cookie バナー等） |
| `waitMs` | 表示後の追加待機ミリ秒（遅延読み込みの重い案件用） |
| `fullPage` | `true` でページ全体を縦長撮影（既定 false = ファーストビューのみ） |

`dismiss` は**バナーが実在する案件にだけ**書く。存在しないセレクタを書いても
「見つからず・続行」の警告が出るだけで無意味。現状の該当は nordic-works のみ。

## 挙動

- 1件失敗しても止まらず続行。最後に成功/失敗の一覧（失敗 URL と理由）を表示する。
- 全件成功で終了コード 0 / 1件でも失敗があれば 1。

## 人間の確認事項（重要）

- **各サイトの掲載許可**、および画面内の**固有情報のマスク判断**（顧客名・個人情報・
  未公開情報など）は、撮影前に人間が確認する。スクリプトはマスクを行わない。
- 撮影後は**画像を目視確認してからコミットする**。特に `fullPage` は reveal の未発火や
  固定バナーの焼き込みが起きやすく 実際に白紙・重なりの事故が起きている
  （`docs/works-capture.md`）。
