'use client';

/**
 * 統合例。既存の Contact ページへ組み込む際の参照実装。
 * 既存フィールド(会社名 / ご依頼の種類 / ご予算 / 希望納期 / 内容)は
 * このパターンに沿って追加すること。
 */

import { useState } from 'react';
import { TextField } from './TextField';
import { ConsentCheckbox } from './ConsentCheckbox';
import { SubmitButton, type SubmitStatus } from './SubmitButton';

/* ---- バリデーションルール(純関数なのでテストも容易) ---- */
const validators = {
  name: (v: string) => (v.trim() ? '' : 'お名前を入力してください'),
  email: (v: string) => {
    if (!v.trim()) return 'メールアドレスを入力してください';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? ''
      : 'メールアドレスの形式が正しくありません';
  },
  consent: (v: boolean) => (v ? '' : 'プライバシーポリシーへの同意が必要です'),
};

type Errors = { name?: string; email?: string; consent?: string };

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [values, setValues] = useState({ name: '', email: '', consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState({ name: false, email: false });

  /* blurで初回検証 → 一度エラーになった欄だけ入力のたび再検証
     ("reward early, punish late" パターン) */
  const handleBlur = (field: 'name' | 'email') => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validators[field](values[field]) }));
  };

  const handleChange = (field: 'name' | 'email', v: string) => {
    setValues((s) => ({ ...s, [field]: v }));
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validators[field](v) }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== 'idle') return;

    const next: Errors = {
      name: validators.name(values.name),
      email: validators.email(values.email),
      consent: validators.consent(values.consent),
    };
    setErrors(next);
    setTouched({ name: true, email: true });

    /* 最初のエラー欄へフォーカスを送る(キーボード/SR利用者への配慮) */
    const firstError = Object.entries(next).find(([, msg]) => msg)?.[0];
    if (firstError) {
      (e.currentTarget.elements.namedItem(firstError) as HTMLElement)?.focus();
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        label="お名前"
        name="name"
        required
        autoComplete="name"
        placeholder="山田 太郎"
        value={values.name}
        error={errors.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      <TextField
        label="メールアドレス"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
      />
      <ConsentCheckbox
        checked={values.consent}
        error={errors.consent}
        onChange={(v) => {
          setValues((s) => ({ ...s, consent: v }));
          if (v) setErrors((e) => ({ ...e, consent: '' }));
        }}
      >
        いただいた情報は返信のみに利用します。
        <a href="/privacy" className="underline underline-offset-4">
          プライバシーポリシー
        </a>
        に同意します
      </ConsentCheckbox>

      <SubmitButton status={status} className="mt-2 w-full" />
    </form>
  );
}
