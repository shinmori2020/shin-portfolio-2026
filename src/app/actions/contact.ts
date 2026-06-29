"use server";

import { Resend } from "resend";
import { z } from "zod";
import { ContactNoticeEmail } from "@/emails/ContactNoticeEmail";
import { ContactAutoReplyEmail } from "@/emails/ContactAutoReplyEmail";

const schema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(100),
  email: z.string().trim().email("メールアドレスの形式が正しくありません"),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "10文字以上で入力してください").max(2000),
});

type FieldKey = "name" | "email" | "company" | "message";

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

  const { name, email, company, message } = parsed.data;

  // 環境変数未設定時はスタブ動作（Resend 契約前でも UI/UX を確認できる）
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !from || !to) {
    console.warn("[contact] Resend 未設定のためスタブ動作で受付");
    return { status: "success", message: "送信を受け付けました（現在はテスト動作）" };
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
      react: ContactNoticeEmail({ name, email, company, message, receivedAt }),
    });
    if (notice.error) throw notice.error;

    // 2. 送信者宛の自動返信（失敗しても運営通知の成功は打ち消さない）
    const autoReply = await resend.emails.send({
      from,
      to: email,
      subject: "お問い合わせを受け付けました",
      react: ContactAutoReplyEmail({ name, message }),
    });
    if (autoReply.error) {
      console.warn("[contact] 自動返信に失敗（運営通知は成功）", autoReply.error);
    }

    return { status: "success", message: "送信を受け付けました。ご連絡ありがとうございます" };
  } catch (err) {
    console.error("[contact] 送信エラー", err);
    return { status: "error", message: "送信に失敗しました。時間をおいて再度お試しください" };
  }
}
