"use client";

import Link from "next/link";
import { useState } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import { SelectField } from "./SelectField";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { SubmitButton, type SubmitStatus } from "./SubmitButton";

const TYPE_OPTIONS = ["Web制作", "開発", "機能追加・改修", "その他"];
const BUDGET_OPTIONS = ["〜10万円", "10〜30万円", "30〜50万円", "50万円〜", "相談したい"];
const DEADLINE_OPTIONS = ["できるだけ早く", "1ヶ月以内", "1〜3ヶ月", "3ヶ月以上", "時期は相談したい"];

const INIT: ContactFormState = { status: "idle", message: "" };

/* バリデーションルール（純関数）。メッセージはサーバー側 Zod と揃える */
const validators = {
  name: (v: string) => (v.trim() ? "" : "お名前を入力してください"),
  email: (v: string) => {
    if (!v.trim()) return "メールアドレスを入力してください";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "メールアドレスの形式が正しくありません";
  },
  message: (v: string) => {
    const t = v.trim();
    if (!t) return "お問い合わせ内容を入力してください";
    return t.length >= 10 ? "" : "10文字以上で入力してください";
  },
  consent: (v: boolean) => (v ? "" : "プライバシーポリシーへの同意が必要です"),
};

type TextKey = "name" | "email" | "message";
type Errors = { name?: string; email?: string; message?: string; consent?: string };

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    type: "",
    budget: "",
    deadline: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
  const [failMessage, setFailMessage] = useState("");

  /* blurで初回検証 → 一度エラーになった欄だけ入力のたび再検証
     ("reward early, punish late" パターン) */
  const changeText = (field: TextKey, v: string) => {
    setValues((s) => ({ ...s, [field]: v }));
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validators[field](v) }));
  };
  const blurText = (field: TextKey) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validators[field](values[field]) }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    const next: Errors = {
      name: validators.name(values.name),
      email: validators.email(values.email),
      message: validators.message(values.message),
      consent: validators.consent(values.consent),
    };
    setErrors(next);
    setTouched({ name: true, email: true, message: true });

    /* 最初のエラー欄へフォーカスを送る（キーボード/SR利用者への配慮）*/
    const firstError = (["name", "email", "message", "consent"] as const).find((k) => next[k]);
    if (firstError) {
      const el = e.currentTarget.elements.namedItem(firstError);
      if (el instanceof HTMLElement) el.focus();
      return;
    }

    setStatus("loading");
    setFailMessage("");

    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("email", values.email);
    fd.set("company", values.company);
    fd.set("type", values.type);
    fd.set("budget", values.budget);
    fd.set("deadline", values.deadline);
    fd.set("message", values.message);

    try {
      const res = await submitContact(INIT, fd);
      if (res.status === "success") {
        setStatus("success");
        return;
      }
      // サーバー側 Zod で弾かれた場合はインラインへ反映して idle に戻す
      if (res.fieldErrors) {
        setErrors((prev) => ({
          ...prev,
          name: res.fieldErrors?.name ?? prev.name,
          email: res.fieldErrors?.email ?? prev.email,
          message: res.fieldErrors?.message ?? prev.message,
        }));
        setStatus("idle");
        return;
      }
      // 送信自体の失敗（メール送信エラー等）
      setFailMessage(res.message || "送信に失敗しました。時間をおいて再度お試しください");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setFailMessage("送信に失敗しました。時間をおいて再度お試しください");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="text-left">
      <div className="grid gap-x-5 sm:grid-cols-2">
        <TextField
          label="お名前"
          name="name"
          required
          autoComplete="name"
          placeholder="山田 太郎"
          value={values.name}
          error={errors.name}
          onChange={(e) => changeText("name", e.target.value)}
          onBlur={() => blurText("name")}
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
          onChange={(e) => changeText("email", e.target.value)}
          onBlur={() => blurText("email")}
        />
        <TextField
          label="会社名"
          name="company"
          autoComplete="organization"
          placeholder="株式会社〇〇"
          value={values.company}
          onChange={(e) => setValues((s) => ({ ...s, company: e.target.value }))}
        />
        <SelectField
          label="ご依頼の種類"
          name="type"
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={(v) => setValues((s) => ({ ...s, type: v }))}
        />
        <SelectField
          label="ご予算"
          name="budget"
          options={BUDGET_OPTIONS}
          value={values.budget}
          onChange={(v) => setValues((s) => ({ ...s, budget: v }))}
        />
        <SelectField
          label="希望納期"
          name="deadline"
          options={DEADLINE_OPTIONS}
          value={values.deadline}
          onChange={(v) => setValues((s) => ({ ...s, deadline: v }))}
        />
      </div>

      <TextArea
        label="お問い合わせ内容"
        name="message"
        required
        rows={6}
        placeholder="ご依頼の概要やご相談したいことをお書きください。"
        value={values.message}
        error={errors.message}
        onChange={(e) => changeText("message", e.target.value)}
        onBlur={() => blurText("message")}
      />

      <div className="mt-3">
        <ConsentCheckbox
          name="consent"
          checked={values.consent}
          error={errors.consent}
          onChange={(v) => {
            setValues((s) => ({ ...s, consent: v }));
            if (v) setErrors((er) => ({ ...er, consent: "" }));
          }}
        >
          いただいた情報は返信のみに利用します。
          <Link href="/privacy" className="underline underline-offset-4 transition-colors hover:text-ink">
            プライバシーポリシー
          </Link>
          に同意します
        </ConsentCheckbox>
      </div>

      <SubmitButton status={status} className="mt-2 w-full" />

      {status === "success" && (
        <p role="status" className="mt-3 text-[13.5px] leading-[1.9] text-muted">
          内容を確認のうえ折り返しご連絡します。返信は1〜2営業日を目安にしています。
        </p>
      )}
      {status === "error" && failMessage && (
        <p role="alert" className="mt-3 text-[13px] text-[#c0362c]">
          {failMessage}
        </p>
      )}
    </form>
  );
}
