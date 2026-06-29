"use client";

import { useActionState, useId } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";

const INIT: ContactFormState = { status: "idle", message: "" };

const ERROR_COLOR = "#c0362c";

const baseInput =
  "w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-accent focus:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--accent)_13%,transparent)]";

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
      <label htmlFor={id} className="mb-2 flex items-center text-[13px] text-ink">
        {label}
        <Badge required={required} />
      </label>
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

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, INIT);
  const msgId = useId();
  const msgErrId = `${msgId}-err`;
  const msgError = state.fieldErrors?.message;

  if (state.status === "success") {
    return (
      <div role="status" className="py-10 text-center">
        <p className="m-0 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">Thank you</p>
        <p className="m-0 mt-3 text-[17px] text-ink">{state.message}</p>
        <p className="m-0 mt-2 text-[13.5px] leading-[1.9] text-muted">
          内容を確認のうえ折り返しご連絡します。返信は1〜2営業日を目安にしています。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 text-left" noValidate>
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

      <div>
        <label htmlFor={msgId} className="mb-2 flex items-center text-[13px] text-ink">
          お問い合わせ内容
          <Badge required />
        </label>
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
        <p role="alert" className="text-[13px]" style={{ color: ERROR_COLOR }}>
          {state.message}
        </p>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] text-white transition-opacity disabled:opacity-60"
        >
          {isPending ? "送信中…" : "送信する"}
          {!isPending && (
            <span aria-hidden className="font-mono transition-transform group-hover:translate-x-[3px]">
              →
            </span>
          )}
        </button>
        <p className="mt-3 text-center text-[12px] leading-[1.8] text-faint">
          いただいた情報は返信のみに利用します。
        </p>
      </div>
    </form>
  );
}
