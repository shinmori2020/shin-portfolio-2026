# View Transitions（Works一覧 ↔ 詳細の共有要素遷移）

Worksのサムネイル（スクリーンショット）を詳細ページのヒーロー画像へ連続変形（morph）させる共有要素トランジションの設計メモ。対応ブラウザのみ発動するプログレッシブエンハンスメントとして実装している。

## 採用アプローチと選定理由

`document.startViewTransition` を薄くラップする自前方式を採用した。公式のフレームワーク機構（React `ViewTransition` コンポーネント / Next.js `experimental.viewTransition`）は**採らなかった**。

理由はバージョン都合である。

- 本プロジェクトは **React 19.1.0（stable）/ Next.js 15.3.9**。
- React の `unstable_ViewTransition` コンポーネントは stable の 19.1.0 には含まれない（`react@experimental` ビルド限定）。
- Next.js の `experimental.viewTransition` フラグはその `unstable_ViewTransition` に依存する。stable React のままフラグを有効化しても機能しない。
- 本番ポートフォリオで `react@experimental` へ差し替えるのは安定性の面で不適当。
- 追加依存（`next-view-transitions` 等）も入れず、依存ゼロで完結させた。

### 将来の移行方針

React の `ViewTransition` が stable 化し Next.js の `experimental.viewTransition` が安定機構になった時点で、**自前ラッパーから公式機構への移行を検討する**。移行時は以下を撤去・置換できる想定：

- `src/components/common/TransitionLink.tsx`（→ 公式のルーティング統合に置換）
- `src/components/common/ViewTransitions.tsx`（→ pathname 監視が不要になる）
- `template.tsx` の `data-vt` 抑制ロジック（→ 二重発火の考え方は残るが実装は要見直し）
- `view-transition-name` / `view-transition-class` の付与自体は概ね流用可能。

### 関連ファイル

| ファイル | 役割 |
|---|---|
| `src/components/common/ViewTransitions.tsx` | pathname 変化＝遷移コミットを検知し、保留中の morph を解決する司令塔。layout に常駐 |
| `src/components/common/TransitionLink.tsx` | `next/link` の薄いラッパー。対応環境かつ通常クリック時のみ `startViewTransition` で包む |
| `src/app/template.tsx` | View Transition 中はページ全体フェードを抑制（二重発火回避） |
| `src/components/common/BrowserFrame.tsx` / `WorkImageLightbox.tsx` | スクリーンショット領域に共有名を付与 |
| `src/app/works/page.tsx` / `works/[slug]/page.tsx` / `page.tsx` | カード等の `TransitionLink` 化・共有名付与 |
| `src/app/globals.css` | 遷移の質感（下記）と縞々対策 |

### 発動条件（フォールバック）

`TransitionLink` は次をすべて満たす時だけ `startViewTransition` を使う。満たさなければ素の `<Link>` 挙動＝現行フェード（`template.tsx` の 180ms）に委ねる。

- `document.startViewTransition` が存在する（対応ブラウザ）
- `prefers-reduced-motion: reduce` でない
- 通常の左クリック（修飾キー無し・同一タブ）
- 外部URL・ハッシュリンクでない

morph の質感（`globals.css`）：

- 共有要素 `::view-transition-group(.work-shot)` … 320ms / `cubic-bezier(0.2, 0.7, 0.3, 1)`
- ページ全体 `::view-transition-*(root)` … 180ms / ease-out（現行フェードと同じ遷移言語）

## 共有名の命名規則と LatestWorkCard 除外の理由

### 命名規則

- 共有名は **`work-shot-${slug}`**。slug ベースで**1ページ内に必ず一意**。
- 質感の指定は各要素に `view-transition-class="work-shot"` を付け、CSS 側は `::view-transition-group(.work-shot)` などクラスで一括ターゲットする（名前は動的なため個別セレクタは書かない）。
- 一覧カード側と詳細ヒーロー側で**同じ名前**を張ることで、両者が対応付き morph する。

> 重要：`view-transition-name` は1ページ内で重複すると**遷移全体が失敗する**。同名を2つ出さないこと。

### LatestWorkCard を除外している理由

Home（`/`）には Works を指す導線が2系統ある。

1. Selected works グリッド（全作品・`works[0]` を含む）
2. ヒーロー右の `LatestWorkCard`（`works[0]` 固定）

両方に `work-shot-${slug}` を張ると、Home 上で **`works[0]` の名前が2回出現＝重複**し、遷移全体が失敗する。これを避けるため：

- Selected works グリッドには共有名を付与する。
- **`LatestWorkCard` には付与しない**（クリック時は現行フェードにフォールバック）。

HANDOFF でも LatestWorkCard への付与は裁量扱いであり、衝突回避を優先してこの構成とした。

## 縞々バグの原因と対策

### 症状

Home の Works カードから詳細へ遷移する時だけ、morph 途中に**黒い斜線（縞々）**が一瞬大きく出た。Works一覧ページからの遷移では出なかった。

### 原因（2つの合わせ技）

1. **暗いスクリムがスナップショットに焼き込まれる**
   Home カードの共有要素の箱の**内側**に、ホバーで出る「View →」の暗い半透明スクリム（`rgba(15,18,14,0.45)`）がある。カードをクリックする瞬間はカーソルがホバー中なので、このスクリムが最大表示のまま morph 用の**旧スナップショットへ焼き込まれる**。
2. **縦横比のズレで旧スナップショットが覗く**
   カードは `16/10`、詳細ヒーローは `16/8.5`。morph 中、新スナップショットの高さが既定で `block-size: auto` になり箱より低くなる → **下側に隙間**ができ、そこから暗い旧スナップショット（＝スクリム＋斜線）が見える。

Works一覧カードは `BrowserFrame` 製で共有要素の箱に**スクリムが無い**ため、同じ隙間が覗いても明るい斜線しか見えず問題にならなかった。これが「一覧からは綺麗・Homeからは縞々」の差の正体。

### 対策

`globals.css` で共有要素の新旧スナップショットを**常に箱いっぱいに覆う**ようにした。

```css
::view-transition-old(.work-shot),
::view-transition-new(.work-shot) {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 縦横比が違っても隙間を作らず覆い切る */
  animation: none;   /* 即入替（二重写りのゴースト防止） */
  mix-blend-mode: normal;
}
```

これで遷移先スナップショットがグループを常に覆い切り、旧スナップショット（暗いスクリム）が隙間から覗かなくなる。縦横比の違う共有要素 morph の定石であり、一覧→詳細・Home→詳細の全パターンが綺麗になる。実スクリーンショット投入後も同じ構造でそのまま効く。

## template.tsx との二重発火回避の仕組み

`template.tsx` はナビゲーションのたびに再マウントされ、`opacity 0 → 1`（180ms）のクロスフェードを掛ける。一方 View Transition 中は `::view-transition-*(root)` の root クロスフェードもページ全体をフェードさせる。**両方が同時に走ると二重にフェード**し、さらに template の初期 `opacity:0` が新スナップショット取得時に効いて共有要素まで薄く写るおそれがある。

これを避けるため、View Transition が走る遷移では template 側のフェードを抑制する。

- `TransitionLink` は `router.push` の直前に `document.documentElement` へ **`data-vt` 属性**を立てる。
- 新ページで再マウントされる `template.tsx` は、レンダー時に `data-vt` の有無を見て、有れば `initial={false}`（フェードしない）にする。
  - SSR / 初回ロードでは `typeof document === "undefined"` ガードで常に通常フェード（ハイドレーション不一致なし）。
- `startViewTransition` の `transition.finished`（resolve/reject 両方）で `data-vt` を除去し、次の通常遷移では従来どおりフェードする。

結果、対応ブラウザの morph 時は **root クロスフェードだけ**がページ遷移を担い、非対応・reduced-motion 時は **template フェードだけ**が担う。両者が二重に発火しない。

### 非同期ナビゲーションとの整合

App Router の `router.push` は非同期で DOM を更新するため、`startViewTransition` のコールバックが返す Promise を「新ルートがコミットされた瞬間」まで保留する必要がある。`ViewTransitions.tsx` が `usePathname` の変化を検知して解決関数（`finishRef`）を呼ぶことでこれを同期させる。万一コミットを検知できなくても固まらないよう、`TransitionLink` 側に 700ms の安全弁を持たせている（通常はそれより先に解決される）。
