import { Body, Container, Head, Heading, Hr, Html, Preview, Text } from "@react-email/components";

interface Props {
  name: string;
  message: string;
}

// 送信者宛の自動返信メール。インラインスタイルで記述。
export function ContactAutoReplyEmail({ name, message }: Props) {
  return (
    <Html lang="ja">
      <Head />
      <Preview>お問い合わせを受け付けました</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>お問い合わせありがとうございます</Heading>
          <Text style={text}>
            {name} 様
            <br />
            お問い合わせを受け付けました。内容を確認のうえ折り返しご連絡いたします。
          </Text>
          <Hr style={hr} />
          <Text style={muted}>以下の内容で送信いただきました。</Text>
          <Text style={messageStyle}>{message}</Text>
          <Hr style={hr} />
          <Text style={sign}>シン｜WEB制作・コーディング</Text>
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
const text: React.CSSProperties = { fontSize: 14, color: "#191b18", lineHeight: 1.9, margin: "16px 0 0" };
const hr: React.CSSProperties = { borderColor: "rgba(20,24,18,0.1)", margin: "20px 0" };
const muted: React.CSSProperties = { color: "#6b6e66", fontSize: 12, margin: 0 };
const messageStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#191b18",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  margin: "8px 0 0",
};
const sign: React.CSSProperties = { fontSize: 13, color: "#6b6e66", margin: 0 };
