---
name: tailwind-v4-darkmode-motion
description: Tailwind CSS v4 + next-themes でクラスベースのダークモードを実装し、Motion (旧 Framer Motion) でスクロール連動アニメを入れる時に使う。@custom-variant の上書き、SSRハイドレーション、prefers-reduced-motion 対応の落とし穴を回避したい時に呼び出す。
license: MIT
metadata:
  version: "1.0.0"
  domain: ui
  triggers: Tailwind v4, dark mode, next-themes, ThemeProvider, ThemeToggle, custom-variant, Motion, Framer Motion, useReducedMotion, useTheme, hydration mismatch, prefers-color-scheme
  role: expert
  scope: implementation
  output-format: code
  related-skills: frontend-design, accessibility, core-web-vitals
---

# Tailwind v4 × next-themes × Motion

Tailwind CSS v4 で **クラスベースのダークモード** を作る正しい構文と、**Motion** でスクロールアニメを入れる際の SSR/prefers-reduced-motion 対応をまとめる。

## Role Definition

あなたは Next.js App Router + Tailwind v4 のフロントエンド実装者。v4 で `tailwind.config.js` が廃止され `@theme` / `@custom-variant` に移行したこと、`<html class="dark">` 切替が prefers-color-scheme と競合すること、`useTheme` のハイドレーション罠、Motion の reduced-motion 配慮に精通している。

## When to Use This Skill

- Tailwind CSS v3 → v4 移行で `darkMode: 'class'` が効かなくなった時
- Next.js App Router でダークモード切替ボタンを作る時
- ハイドレーション mismatch（`Hydration failed because the server-rendered HTML...`）が出た時
- Motion (Framer Motion) でスクロール連動 fadein を作りたい時
- アクセシビリティ的に `prefers-reduced-motion` 対応を入れたい時
- CSS変数で配色を一元管理したい時

## Core Workflow

### 1. Tailwind v4 の `@custom-variant` でクラス連動ダークモード

```css
/* web/src/app/globals.css */
@import "tailwindcss";

/* v4 のデフォルト dark: は prefers-color-scheme 連動。
   next-themes は <html class="dark"> を切り替えるので、
   クラス連動に上書きする必要がある。 */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #171717;
}
.dark {
  --background: #09090b;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

**ポイント**:
- v3 の `darkMode: 'class'` 相当を `@custom-variant` で表現する
- `&:where(.dark, .dark *)` の `:where()` で詳細度を上げない（衝突回避）
- 配色は CSS 変数で一元管理（`bg-zinc-900 dark:bg-zinc-100` の重複を CSS 側に押し付ける選択肢）

### 2. ThemeProvider のセットアップ

```bash
pnpm add next-themes motion
```

```tsx
// web/src/components/common/ThemeProvider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

```tsx
// web/src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**`suppressHydrationWarning` を `<html>` に必ず付ける**（next-themes が SSR 直後にクラスを書き換えるため）。

### 3. ThemeToggle（ハイドレーション安全）

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? (isDark ? 'ライトモードに切替' : 'ダークモードに切替') : 'テーマを切替'}
      className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {!mounted ? (
        // ハイドレーション前は空のプレースホルダー（レイアウトシフト防止 + mismatch 回避）
        <span className="h-5 w-5" aria-hidden="true" />
      ) : isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### 4. Motion (旧 Framer Motion) のスクロール連動

```tsx
'use client';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props { children: ReactNode; delay?: number; className?: string; }

export function Reveal({ children, delay = 0, className }: Props) {
  const reduceMotion = useReducedMotion();

  // 動きを嫌うユーザーはそのまま表示
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

**使い方**: Server Component のカードを包む:

```tsx
<Reveal delay={0.1}><ArticleCard {...post} /></Reveal>
```

## 落とし穴（このプロジェクトで実際に踏んだもの）

### 1. **Tailwind v4 では `tailwind.config.js` が無い**

v3 までの `darkMode: 'class'` をどこに書けばいいか分からなくなる。

**v3**: `tailwind.config.js` の `darkMode: 'class'`
**v4**: `globals.css` の `@custom-variant dark (...)`

v4 はゼロコンフィグ志向で、設定は CSS の `@theme` / `@custom-variant` に統一された。

### 2. **`@custom-variant` を書かないと dark: が OS 設定連動になる**

v4 のデフォルトの `dark:` は `@media (prefers-color-scheme: dark)` に展開される。next-themes で手動切替したいなら **必ず `@custom-variant` で上書き** する必要がある。

書かないと: ボタンを押しても見た目が変わらない（クラスは付くが Tailwind がそれを見ない）。

### 3. **`:where()` を使う理由**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`:where()` は **詳細度を0にする**。これによって `dark:bg-zinc-900` の詳細度が `bg-zinc-900` と同じになり、Tailwind の last-wins ルール（後勝ち）が正しく機能する。

`:where()` を外して `&.dark, .dark &` と書くと、詳細度が上がってカスタム CSS と競合する。

### 4. **`suppressHydrationWarning` を忘れるとコンソールが警告で埋まる**

next-themes は SSR では `class` を付けず、クライアントで JS が走ってから `<html class="dark">` を付ける。これが React のハイドレーション検出に引っかかる:

```
Warning: Prop `className` did not match. Server: "" Client: "dark"
```

`<html lang="ja" suppressHydrationWarning>` を付けると、html 要素だけ警告を抑制できる。**`<body>` には付けない**（他のmismatch を見逃す原因になる）。

### 5. **`useTheme` の初期値は SSR で不定**

`useTheme()` を Server Component で使えないのは当然だが、Client Component でも **初回レンダリング時は `resolvedTheme` が `undefined`**。これを直接 UI に出すと flash する:

```tsx
// ❌ サーバー描画では isDark=false、クライアント描画では isDark=true → アイコンが切り替わって見える
const isDark = resolvedTheme === 'dark';
return <button>{isDark ? '☀' : '🌙'}</button>;

// ✅ mounted フラグで初回はプレースホルダー
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
return <button>{!mounted ? <Placeholder /> : isDark ? '☀' : '🌙'}</button>;
```

プレースホルダーは「**同じサイズ・透明な領域**」にすると CLS が出ない。

### 6. **`<html>` への class 注入時の FOUC**

SSR では `class` が付いていない → 一瞬ライトモードで描画 → JS が走って `dark` クラスが付く → 黒く切り替わる。

**対処**: next-themes は `<head>` に inline script を自動注入してこの FOUC を防いでくれる（OS 設定を読んで描画前に `class` を付ける）。`enableSystem` と `attribute="class"` を渡せば自動で有効。

**手動で増やしたい場合**: `defaultTheme="system"` + `enableSystem` + `disableTransitionOnChange` を組み合わせる。`disableTransitionOnChange` は切替の瞬間 transition を切ることで、全要素が一斉にアニメーションする「ピカピカ」を防ぐ。

### 7. **`motion/react` パッケージ名（旧 `framer-motion`）**

2024 年に Framer Motion は **Motion** にリブランドされ、パッケージ名も変わった:

```bash
# 旧
pnpm add framer-motion
import { motion } from 'framer-motion';

# 新
pnpm add motion
import { motion } from 'motion/react';
```

API は互換だが、import パスが変わっている。**`framer-motion` のままだとアップデートで死ぬ可能性**があるので `motion` に移行する。

### 8. **`useReducedMotion` を必ず尊重する**

WCAG 2.3.3 (Animation from Interactions, Level AAA) に該当。`prefers-reduced-motion: reduce` の設定はめまい・前庭障害のあるユーザーへの配慮なので、UI 装飾アニメは完全に止めるべき:

```tsx
const reduceMotion = useReducedMotion();
if (reduceMotion) return <div className={className}>{children}</div>;
```

「弱める」より「無くす」が正解。動かない version を別途用意する。

### 9. **`whileInView` + `viewport.once` の組み合わせ**

スクロール連動 fadein は **一度だけ**動くのが定番:

```tsx
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-80px' }}
```

`once: true` を入れないと、画面を上下するたびに再アニメーションして煩い。`margin: '-80px'` は「ビューポート上端から 80px 入ったらトリガー」の意味（早めに発火）。

### 10. **CSS変数 vs `dark:` クラス**

ダークモードの実装方針は2つ:

**A. CSS変数で配色を一元管理**
```css
.dark { --background: #09090b; }
body { background: var(--background); }
```
配色変更が CSS の1箇所で済む。Tailwind の `bg-zinc-900` 等を直接書きにくい。

**B. `dark:` クラスを各所に書く**
```tsx
<div className="bg-white dark:bg-zinc-900">
```
直感的だが、配色変更時に全コンポーネントを書き換える。

このプロジェクトは **A と B のハイブリッド**: bodyの背景・前景は CSS 変数、コンポーネント内の細かい色は `dark:` クラス。完全な統一は難しいので、用途で割り切る。

### 11. **モーダルやドロップダウンの背景は CSS 変数を使うと事故が減る**

「白背景の上に半透明黒のオーバーレイ」のような UI はダーク時に逆転する。`dark:` 系で書いてもよいが、CSS変数 + `color-mix()` を使うと一発:

```css
--overlay: color-mix(in srgb, var(--foreground) 60%, transparent);
```

## Constraints

### MUST DO
- Tailwind v4 + next-themes は `@custom-variant dark (&:where(.dark, .dark *));` を `globals.css` に書く
- `<html suppressHydrationWarning>` を必ず付ける
- ThemeToggle は `mounted` フラグでハイドレーション前のプレースホルダーを描画
- next-themes は `attribute="class" defaultTheme="system" enableSystem`
- Motion は `motion/react` から import（`framer-motion` ではない）
- `useReducedMotion` を必ず確認し、true なら静的に描画
- `whileInView` には `viewport={{ once: true }}` を付ける

### MUST NOT DO
- v4 で `tailwind.config.js` の `darkMode: 'class'` を書かない（廃止）
- `@custom-variant` を書かずに `dark:` を使わない（prefers連動になる）
- `<body suppressHydrationWarning>` を書かない（他mismatch を隠す）
- `resolvedTheme` を直接 SSR 表示に使わない（mounted フラグで段階表示）
- `framer-motion` をそのまま使い続けない（`motion` に移行）
- アニメーションを `prefers-reduced-motion` で「弱める」だけにしない（無くす）

## 関連

- UI 設計全般のクオリティ・ビジュアル方針 → [[frontend-design]]
- `prefers-reduced-motion` の WCAG 詳細、フォーム/モーダルの a11y → [[accessibility]]
- アニメーションが CLS/INP に与える影響 → [[core-web-vitals]]
