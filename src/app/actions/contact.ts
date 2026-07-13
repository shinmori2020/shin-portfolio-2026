"use server";

import { Resend } from "resend";
import { z } from "zod";
import { ContactNoticeEmail } from "@/emails/ContactNoticeEmail";
import { ContactAutoReplyEmail } from "@/emails/ContactAutoReplyEmail";

const schema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(100),
  email: z.string().trim().email("メールアドレスの形式が正しくありません"),
  company: z.string().trim().max(100).optional(),
  type: z.string().trim().max(50).optional(),
  budget: z.string().trim().max(50).optional(),
  deadline: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10, "10文字以上で入力してください").max(2000),
});

type FieldKey = "name" | "email" | "company" | "type" | "budget" | "deadline" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    type: formData.get("type"),
    budget: formData.get("budget"),
    deadline: formData.get("deadline"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "入力内容を確認してください", fieldErrors };
  }

  const { name, email, company, type, budget, deadline, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  // 独自ドメイン登録前は Resend のサンドボックス送信元を使う。
  // ドメイン検証後は CONTACT_EMAIL_FROM に自ドメインのアドレスを入れるだけで切り替わる。
  const from = process.env.CONTACT_EMAIL_FROM ?? "シン ポートフォリオ <onboarding@resend.dev>";
  const isSandboxSender = from.includes("onboarding@resend.dev");

  // APIキー未設定時のみスタブ動作（ローカルで Resend 契約前でも UI/UX を確認できる）
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY 未設定のためスタブ動作で受付");
    return { status: "success", message: "送信を受け付けました（現在はテスト動作）" };
  }
  // キーはあるのに宛先が無いのは設定漏れ。偽の成功を返さずエラーにする
  if (!to) {
    console.error("[contact] CONTACT_EMAIL_TO が未設定のため送信できません");
    return { status: "error", message: "送信に失敗しました。時間をおいて再度お試しください" };
  }

  const resend = new Resend(apiKey);
  const receivedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  try {
    // 1. 運営宛の通知（返信は問い合わせ者に直接届くよう replyTo を設定）
    const notice = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `お問い合わせ - ${name} 様`,
      react: ContactNoticeEmail({ name, email, company, type, budget, deadline, message, receivedAt }),
    });
    if (notice.error) throw notice.error;

    // 2. 送信者宛の自動返信（失敗しても運営通知の成功は打ち消さない）
    // サンドボックス送信元では Resend アカウント本人以外へ送れず必ず 403 になるため送信しない。
    // 独自ドメインを CONTACT_EMAIL_FROM に設定した時点で自動的に有効化される。
    if (isSandboxSender && email.toLowerCase() !== to.toLowerCase()) {
      console.info("[contact] 独自ドメイン未設定のため自動返信はスキップ（運営通知は送信済み）");
    } else {
      const autoReply = await resend.emails.send({
        from,
        to: email,
        subject: "お問い合わせを受け付けました",
        react: ContactAutoReplyEmail({ name, message }),
      });
      if (autoReply.error) {
        console.warn("[contact] 自動返信に失敗（運営通知は成功）", autoReply.error);
      }
    }

    return { status: "success", message: "送信を受け付けました。ご連絡ありがとうございます" };
  } catch (err) {
    console.error("[contact] 送信エラー", err);
    return { status: "error", message: "送信に失敗しました。時間をおいて再度お試しください" };
  }
}
