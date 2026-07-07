# 制作物の画像置き場（規約）

ここに画像を「置くだけ」で サイトに自動反映されます（該当案件のデータ編集は不要）。
画像が無い案件は自動で斜線プレースホルダーにフォールバックします。

## 置き方

```
public/works/{slug}/cover.webp   ← 一覧カード・詳細ヒーロー・トップのカードに共用
public/works/{slug}/full.webp    ← 詳細ページの「全体を見る」縦長スクショ（任意）
```

- `{slug}` は各案件の URL キー。現在の案件は次の4つ:
  - `headless-wp-media`
  - `multilingual-ec`
  - `estimate-simulator`
  - `proposal-builder`
- 対応拡張子: `webp` / `png` / `jpg` / `jpeg` / `avif`（`webp` 推奨）。
  同じ base 名で複数拡張子があると webp→png→jpg… の順で最初に見つかったものを使用。
- `full` を置かない場合は `cover` が全景表示にも使われます。

## 推奨

- カバー: ファーストビュー付近の横長。幅1600px以上で撮影→ WebP 書き出し・1枚500KB以下目安。
- 差し替えは この配下にファイルを追加して push するだけ（次のデプロイで反映）。

詳細な撮影・命名の手順は リポジトリ同梱の HUMAN_TASKS.md を参照。
