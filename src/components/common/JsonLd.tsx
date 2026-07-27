// 構造化データ（JSON-LD）を出力する共通コンポーネント。
//
// Next の metadata API は JSON-LD を扱わないため <script> を直接置く。
// 表示には影響しないサーバコンポーネントで クライアントJSは増えない。
// 型のためだけに schema-dts を足すほどの規模ではないため 素の JSON として扱う。
//
// 検証: https://search.google.com/test/rich-results

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
type JsonLdObject = { [key: string]: JsonLdValue };

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON 内の生の < は </script> と解釈され得るためエスケープする
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
