---
name: resend-react-email-form
description: Next.js App Router で Resend + React Email + Server Action を組み合わせて問い合わせフォームを作る時に使う。Zod バリデーション、useActionState、Resend 無料枠の to 制限、replyTo、JSX メールの罠を回避したい時に呼び出す。
license: MIT
metadata:
  version: "1.0.0"
  domain: platform
  triggers: Resend, React Email, Server Action, useActionState, Zod, contact form, transactional email, react-email/components, replyTo, onboarding@resend.dev
  role: expert
  scope: implementation
  output-format: code
  related-skills: headless-nextjs-wp, accessibility
---

# Resend × React Email × Server Action

問い合わせフォームを **「Server Action + Zod + React Email + Resend」** の構成で作るためのガイド。フリーミアム特有の送信先制限、自動返信の失敗ハンドリング、JSX メールのCSS制約を整理する。

## Role Definition

あなたは Next.js App Router の Server Action と Resend / React Email の実装者。Zod での FormData バリデーション、`useActionState` のステート設計、React Email の CSS-in-JS 制約、Resend Free プランの to 制限、自動返信失敗時のフォールバック設計に精通している。

## When to Use This Skill

- 新規に問い合わせ／資料請求フォームを作る時
- Server Action から Resend でトランザクションメールを送る構成を作る時
- 「運営通知 + 送信者宛 自動返信」の2通同時送信パターンを実装する時
- メール本文を JSX で書きたい（HTML 文字列を組み立てたくない）時
- Resend Free プランで本番運用前の動作確認をする時

## Core Workflow

### 1. パッケージ

```bash
pnpm add resend @react-email/components zod
```

### 2. ファイル構成

```
web/src/
├── emails/
│   ├── ContactNoticeEmail.tsx      # 運営宛通知
│   └── ContactAutoReplyEmail.tsx   # 送信者宛 自動返信
├── app/
│   ├── actions/contact.ts          # Server Action
│   └── (corporate)/contact/page.tsx  # ページ
└── components/forms/
    └── ContactForm.tsx             # 'use client', useActionState
```

### 3. Server Action（核心）

```typescript
'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { ContactNoticeEmail } from '@/emails/ContactNoticeEmail';
import { ContactAutoReplyEmail } from '@/emails/ContactAutoReplyEmail';

const schema = z.object({
  name:    z.string().trim().min(1, 'お名前を入力').max(100),
  email:   z.string().trim().email('メール形式が不正'),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, '10文字以上').max(2000),
});

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors?: Partial<Record<'name'|'email'|'company'|'message', string>>;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
  });
  if (!parsed.success) {
    const fieldErrors: ContactFormState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactFormState['fieldErrors']>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: 'error', message: '入力を確認してください', fieldErrors };
  }

  const { name, email, company, message } = parsed.data;

  // 環境変数未設定時はスタブ動作（開発時）
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !from || !to) {
    console.warn('[contact] Resend 未設定。スキップ。');
    return { status: 'success', message: '受け付けました（スタブ）' };
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  try {
    // 1. 運営宛通知
    const notice = await resend.emails.send({
      from, to,
      replyTo: email,          // 返信は問い合わせ者に直接届く
      subject: `お問い合わせ - ${name} 様`,
      react: ContactNoticeEmail({ name, email, company, message, receivedAt }),
    });
    if (notice.error) throw notice.error;

    // 2. 送信者宛 自動返信（失敗しても運営通知は成功扱い）
    const autoReply = await resend.emails.send({
      from, to: email,
      subject: 'お問い合わせを受け付けました',
      react: ContactAutoReplyEmail({ name, message }),
    });
    if (autoReply.error) {
      console.warn('[contact] 自動返信失敗:', autoReply.error);
    }

    return { status: 'success', message: '受け付けました' };
  } catch (err) {
    console.error('[contact] 送信エラー:', err);
    return { status: 'error', message: '送信に失敗しました' };
  }
}
```

### 4. React Email テンプレ

```tsx
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components';

export function ContactNoticeEmail({ name, email, message, receivedAt }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`${name} 様からお問い合わせ`}</Preview>  {/* 受信箱のプレビュー文 */}
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>新しいお問い合わせ</Heading>
          <Text style={muted}>受付日時: {receivedAt}</Text>
          <Hr style={hr} />
          <Text style={row}><strong>お名前</strong>{name}</Text>
          <Text style={row}><strong>メール</strong>{email}</Text>
          <Hr style={hr} />
          <Text style={messageStyle}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

// スタイルは React.CSSProperties のオブジェクトで定義（後述の理由）
const body: React.CSSProperties = { backgroundColor: '#f4f4f5', padding: '24px 0' };
const container: React.CSSProperties = { backgroundColor: '#fff', maxWidth: 560, margin: '0 auto', padding: 32, borderRadius: 8 };
const h1: React.CSSProperties = { fontSize: 20, margin: 0 };
const muted: React.CSSProperties = { color: '#71717a', fontSize: 12 };
const hr: React.CSSProperties = { borderColor: '#e4e4e7', margin: '20px 0' };
const row: React.CSSProperties = { fontSize: 14, margin: '4px 0' };
const messageStyle: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' };
```

### 5. フォーム（Client Component）

```tsx
'use client';
import { useActionState } from 'react';
import { submitContact, type ContactFormState } from '@/app/actions/contact';

const INIT: ContactFormState = { status: 'idle', message: '' };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, INIT);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="お名前" name="name" required error={state.fieldErrors?.name} />
      <Field label="メール" name="email" type="email" required error={state.fieldErrors?.email} />
      <Field label="会社名" name="company" error={state.fieldErrors?.company} />
      <Textarea label="お問い合わせ内容" name="message" required error={state.fieldErrors?.message} />

      <button type="submit" disabled={isPending}>
        {isPending ? '送信中…' : '送信する'}
      </button>

      {state.status === 'success' && <p role="status">{state.message}</p>}
      {state.status === 'error' && <p role="alert">{state.message}</p>}
    </form>
  );
}
```

## 落とし穴（このプロジェクトで実際に踏んだもの）

### 1. **Resend Free + `onboarding@resend.dev` は to 制限がある**

Free プラン + 独自ドメイン未登録だと、`from: onboarding@resend.dev` で送信できる **`to` は Resend アカウントに登録したメールアドレスのみ**。

**症状**: 運営通知（`to: yourname@example.com`）は届くが、**自動返信**（`to: <問い合わせ者>`）が `403 You can only send testing emails to your own email address` で失敗。

**対処（このプロジェクトで採用）**: 自動返信の失敗は **運営通知の成功を打ち消さない設計** にする。`autoReply.error` が出てもログに残して `success` を返す:

```typescript
if (autoReply.error) {
  console.warn('[contact] 自動返信失敗（運営通知は成功）:', autoReply.error);
}
return { status: 'success', message: '受け付けました' };
```

**本番**: 独自ドメインを Resend に登録 + DNS (SPF/DKIM) 設定 → 任意の to に送れるようになる。

### 2. **`replyTo` を必ず設定する**

`from: onboarding@resend.dev` のまま運営通知を送ると、受信した側が「返信」を押すと **Resend にメールが行ってしまう**（届かない）。

```typescript
await resend.emails.send({
  from, to,
  replyTo: email,   // ← 問い合わせ者のメール
  ...
});
```

これで受信者の「返信」ボタンが直接問い合わせ者に届く。

### 3. **`useActionState` の初期値は型と一致させる**

`useActionState(action, initialState)` の `initialState` が型と合わないと、初回レンダリングで `state.fieldErrors?.email` が `undefined` で TS エラーや実行時エラーになる。

```typescript
const INIT: ContactFormState = {
  status: 'idle',
  message: '',
  // fieldErrors は optional なので未定義でOK
};
```

`status` を Union type にしておくと、`state.status === 'success'` の絞り込みが効く。

### 4. **React Email の CSS は className じゃなくインラインスタイル**

`@react-email/components` は **メーラー互換性のため className を使わない**（多くのメーラーが `<style>` を無視するため）。CSS は React.CSSProperties オブジェクトでインライン指定する:

```tsx
// ❌ メーラーで効かない
<Text className="text-lg text-zinc-900">...</Text>

// ✅ インラインスタイル
<Text style={{ fontSize: 18, color: '#18181b' }}>...</Text>
```

Tailwind の感覚で書こうとすると詰まる。React Email 公式は **`tw=` prop** をサポートする `@react-email/tailwind` パッケージもあるが、対応範囲が限られる。最初はインラインで書くのが確実。

### 5. **`<Preview>` は受信箱のプレビュー文**

`<Preview>{...}</Preview>` は本文の最初に隠し要素として埋め込まれる。受信箱のサブジェクト下に出るプレビュー文を制御する。**入れないとメール本文の最初の文字が出る**ので、HTMLの構造的な文言（"View in browser" 等）が表示されて格好悪い。

### 6. **`whiteSpace: 'pre-wrap'` で改行保持**

ユーザーが入力した `message` には改行が含まれる。CSS で `whiteSpace: 'pre-wrap'` を当てないと、メーラーで全部1行になる。

```tsx
const messageStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',  // ← 必須
  lineHeight: 1.7,
};
```

### 7. **Server Action の `_prev` 引数を忘れない**

`useActionState` 用の Server Action は **第1引数が前回の state、第2引数が FormData**。これを `(formData: FormData) => ...` で書くと型エラー:

```typescript
// ❌
export async function submitContact(formData: FormData) { ... }

// ✅
export async function submitContact(_prev: ContactFormState, formData: FormData) { ... }
```

`_prev` を使わなくてもアンダースコア付きで受ける。

### 8. **環境変数未設定時のスタブ動作**

Resend キー未設定でフォームを試すと、毎回 `error` が返って開発体験が悪い。**未設定なら success を返すスタブモード**を入れる:

```typescript
if (!apiKey || !from || !to) {
  console.warn('[contact] Resend 未設定。スキップ。');
  return { status: 'success', message: '受け付けました（スタブ）' };
}
```

これで Resend 契約前でも UI/UX を完成させられる。

### 9. **Zod の `.trim()` は `.min()` の前に**

```typescript
// ❌ 空白だけの入力が通る
z.string().min(1)

// ✅ 先にトリム
z.string().trim().min(1, 'お名前を入力')
```

### 10. **`role="alert"` / `role="status"` で a11y を整える**

エラー/成功メッセージは支援技術にも届けるべき。送信完了の文言を `role="status"`、失敗を `role="alert"` で書くと、スクリーンリーダーが読み上げる。

```tsx
{state.status === 'success' && <p role="status">{state.message}</p>}
{state.status === 'error'   && <p role="alert">{state.message}</p>}
```

各フィールドエラーも `aria-describedby` で関連付ける。詳細は [[accessibility]] 参照。

## 環境変数

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_FROM=onboarding@resend.dev   # 独自ドメイン未登録時
# CONTACT_EMAIL_FROM=hello@yourcompany.com  # 独自ドメイン登録後
CONTACT_EMAIL_TO=yourname@example.com      # Resend アカウントと同じ
```

Vercel: `RESEND_API_KEY` は **Sensitive: ON**、`CONTACT_EMAIL_*` は OFF（漏れても被害は少ない）。

## Constraints

### MUST DO
- Server Action 内で Zod バリデーション（`safeParse`）
- `replyTo` を必ず設定（運営通知の場合）
- 自動返信失敗を運営通知の成功と独立に扱う
- 環境変数未設定時のスタブ動作を入れる（開発体験）
- React Email は **インラインスタイル**
- `useActionState` の Server Action は `(_prev, formData)` の2引数
- `whiteSpace: 'pre-wrap'` でメッセージ改行を保持

### MUST NOT DO
- React Email で `className` を使わない（Tailwind 直書きは効かない）
- `from` に届かないアドレスを設定しない（Resend が拒否）
- 自動返信の失敗で全体を error 扱いしない
- `RESEND_API_KEY` を `NEXT_PUBLIC_*` に入れない
- Zod の `.trim()` を省略しない

## 関連

- フォームの a11y（aria-describedby, role 等）詳細 → [[accessibility]]
- 同じプロジェクト内で使うフェッチ層 → [[headless-nextjs-wp]]
