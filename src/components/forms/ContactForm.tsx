"use client";

import { useActionState, useId } from "react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";

const INIT: ContactFormState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color] placeholder:text-faint focus:border-accent";

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-muted">
        {label}
        {optional ? <span className="ml-1 text-faint">（任意）</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={inputClass}
      />
      {error ? (
        <p id={errId} className="mt-1.5 text-[12.5px] text-[#c0362c]">
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

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-surface px-7 py-12 text-center"
      >
        <p className="m-0 font-mono text-[12px] uppercase tracking-[0.2em] text-accent">
          Thank you
        </p>
        <p className="m-0 mt-3 text-[17px] text-ink">{state.message}</p>
        <p className="m-0 mt-2 text-[13.5px] leading-[1.9] text-muted">
          内容を確認のうえ折り返しご連絡します。返信は1〜2営業日を目安にしています。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 text-left">
      <Field label="お名前" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
      <Field
        label="メールアドレス"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <Field
        label="会社名"
        name="company"
        optional
        autoComplete="organization"
        error={state.fieldErrors?.company}
      />

      <div>
        <label htmlFor={msgId} className="mb-1.5 block text-[13px] text-muted">
          お問い合わせ内容
        </label>
        <textarea
          id={msgId}
          name="message"
          required
          rows={5}
          placeholder="ご依頼の概要やご相談したいことをお書きください。"
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? msgErrId : undefined}
          className={`${inputClass} resize-y leading-[1.8]`}
        />
        {state.fieldErrors?.message ? (
          <p id={msgErrId} className="mt-1.5 text-[12.5px] text-[#c0362c]">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] text-white transition-[opacity] disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "送信中…" : "送信する"}
          {!isPending && (
            <span aria-hidden className="font-mono transition-transform group-hover:translate-x-[3px]">
              →
            </span>
          )}
        </button>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p role="alert" className="text-[13px] text-[#c0362c]">
          {state.message}
        </p>
      )}
    </form>
  );
}
