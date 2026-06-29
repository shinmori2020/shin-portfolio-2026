import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components";

interface Props {
  name: string;
  email: string;
  company?: string;
  type?: string;
  budget?: string;
  deadline?: string;
  message: string;
  receivedAt: string;
}

// 運営（シン）宛の通知メール。メーラー互換のためインラインスタイルで記述。
export function ContactNoticeEmail({
  name,
  email,
  company,
  type,
  budget,
  deadline,
  message,
  receivedAt,
}: Props) {
  const rows: Array<[string, string]> = [
    ["お名前", name],
    ["メール", email],
  ];
  if (company) rows.push(["会社名", company]);
  if (type) rows.push(["ご依頼の種類", type]);
  if (budget) rows.push(["ご予算", budget]);
  if (deadline) rows.push(["希望納期", deadline]);

  return (
    <Html lang="ja">
      <Head />
      <Preview>{`${name} 様からお問い合わせが届きました`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>新しいお問い合わせ</Heading>
          <Text style={muted}>受付日時: {receivedAt}</Text>
          <Hr style={hr} />
          {rows.map(([k, v]) => (
            <Text key={k} style={row}>
              <strong style={label}>{k}</strong>
              {v}
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={messageStyle}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f4f3ef",
  padding: "24px 0",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: 560,
  margin: "0 auto",
  padding: 32,
  borderRadius: 12,
  border: "1px solid rgba(20,24,18,0.1)",
};
const h1: React.CSSProperties = { fontSize: 20, color: "#191b18", margin: 0 };
const muted: React.CSSProperties = { color: "#6b6e66", fontSize: 12, margin: "8px 0 0" };
const hr: React.CSSProperties = { borderColor: "rgba(20,24,18,0.1)", margin: "20px 0" };
const row: React.CSSProperties = { fontSize: 14, color: "#191b18", margin: "6px 0" };
const label: React.CSSProperties = { display: "inline-block", width: 72, color: "#6b6e66" };
const messageStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#191b18",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
};
