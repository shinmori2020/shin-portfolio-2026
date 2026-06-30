"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";

const INIT: ContactFormState = { status: "idle", message: "" };

const ERROR_COLOR = "#c0362c";

const baseInput =
  "w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-accent focus:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--accent)_13%,transparent)]";

const TYPE_OPTIONS = ["Web制作", "開発", "機能追加・改修", "その他"];
const BUDGET_OPTIONS = ["〜10万円", "10〜30万円", "30〜50万円", "50万円〜", "相談したい"];
const DEADLINE_OPTIONS = ["できるだけ早く", "1ヶ月以内", "1〜3ヶ月", "3ヶ月以上", "時期は相談したい"];

function borderClass(error?: string) {
  return error ? "border-[#c0362c]" : "border-line";
}

function Badge({ required }: { required: boolean }) {
  return required ? (
    <span className="ml-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2 py-[2px] text-[10px] tracking-[0.04em] text-accent">
      必須
    </span>
  ) : (
    <span className="ml-2 text-[11px] text-faint">任意</span>
  );
}

function FieldLabel({ htmlFor, label, required }: { htmlFor: string; label: string; required: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center text-[13px] text-ink">
      {label}
      <Badge required={required} />
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${baseInput} ${borderClass(error)}`}
      />
      {error ? (
        <p id={errId} className="mt-1.5 text-[12.5px]" style={{ color: ERROR_COLOR }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required = false,
  placeholder = "選択してください",
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          className={`${baseInput} border-line appearance-none pr-10`}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted"
        >
          ▾
        </span>
      </div>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, INIT);
  const msgId = useId();
  const msgErrId = `${msgId}-err`;
  const msgError = state.fieldErrors?.message;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-surface px-7 py-14 text-center"
      >
        <p className="m-0 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">Thank you</p>
        <p className="m-0 mt-3 text-[17px] text-ink">{state.message}</p>
        <p className="m-0 mt-2 text-[13.5px] leading-[1.9] text-muted">
          内容を確認のうえ折り返しご連絡します。返信は1〜2営業日を目安にしています。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="text-left" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="お名前" name="name" required autoComplete="name" placeholder="山田 太郎" error={state.fieldErrors?.name} />
        <Field
          label="メールアドレス"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          error={state.fieldErrors?.email}
        />
        <Field
          label="会社名"
          name="company"
          autoComplete="organization"
          placeholder="株式会社〇〇"
          error={state.fieldErrors?.company}
        />
        <Select label="ご依頼の種類" name="type" options={TYPE_OPTIONS} />
        <Select label="ご予算" name="budget" options={BUDGET_OPTIONS} />
        <Select label="希望納期" name="deadline" options={DEADLINE_OPTIONS} />
      </div>

      <div className="mt-5">
        <FieldLabel htmlFor={msgId} label="お問い合わせ内容" required />
        <textarea
          id={msgId}
          name="message"
          required
          rows={6}
          placeholder="ご依頼の概要やご相談したいことをお書きください。"
          aria-required
          aria-invalid={msgError ? true : undefined}
          aria-describedby={msgError ? msgErrId : undefined}
          className={`${baseInput} ${borderClass(msgError)} resize-y leading-[1.8]`}
        />
        {msgError ? (
          <p id={msgErrId} className="mt-1.5 text-[12.5px]" style={{ color: ERROR_COLOR }}>
            {msgError}
          </p>
        ) : null}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="mt-4 text-[13px]" style={{ color: ERROR_COLOR }}>
          {state.message}
        </p>
      )}

      {/* 送信ボタンはこのフォーム専用デザイン（サイトの他ボタンと差別化）。
          角丸 2xl / 全幅 / 円形の矢印バッジ / ホバーで地色がわずかに沈み光がスイープ。 */}
      <div className="mt-7">
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full overflow-hidden rounded-2xl bg-accent px-8 py-[18px] text-[15.5px] font-medium tracking-[0.02em] text-white transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_88%,#000)] disabled:opacity-60"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-[700ms] ease-out group-hover:translate-x-full motion-reduce:hidden"
          />
          <span className="relative z-10 inline-flex items-center justify-center">
            {isPending ? "送信中…" : "送信する"}
          </span>
        </button>
        <p className="mt-3 text-left text-[12px] leading-[1.8] text-faint">
          いただいた情報は返信のみに利用します。{" "}
          <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-muted">
            プライバシーポリシー
          </Link>
        </p>
      </div>
    </form>
  );
}
