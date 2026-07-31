"use client";

// レイアウト自体が壊れた場合の受け皿。error.tsx はレイアウトの内側にあるため
// レイアウトが落ちると出番が無く この global-error.tsx がルートごと置き換わる。
//
// 制約: レイアウトが置き換わる＝ヘッダー / フッター / フォント / テーマ切替が使えない。
// globals.css も読み込まれないため Tailwind のクラスもトークンも効かない。
// そのため <html> と <body> から自前で書き 色は実値を直書きする。
// 凝った作りにせず「確実に出ること」だけを優先する。
//
// 本番ビルドでのみ表示される（開発時は Next.js のエラーオーバーレイが優先される）。

const CSS = `
  :root {
    --g-bg: #f4f3ef;
    --g-ink: #191b18;
    --g-muted: #6b6e66;
    --g-accent: #214034;
    --g-on-accent: #ffffff;
    --g-line: rgba(20, 24, 18, 0.2);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --g-bg: #0d100e;
      --g-ink: #edf0ea;
      --g-muted: #9aa09a;
      --g-accent: #74b491;
      --g-on-accent: #0d100e;
      --g-line: rgba(255, 255, 255, 0.18);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: var(--g-bg);
    color: var(--g-ink);
    font-family: system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Yu Gothic UI", Meiryo, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .g-wrap { width: 100%; max-width: 620px; }
  .g-label {
    margin: 0 0 24px;
    font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--g-accent);
  }
  .g-title {
    margin: 0;
    font-size: clamp(26px, 5vw, 40px);
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: -0.02em;
    text-wrap: balance;
    word-break: auto-phrase;
  }
  .g-text {
    margin: 20px 0 0;
    font-size: 15px;
    line-height: 1.9;
    color: var(--g-muted);
    word-break: auto-phrase;
  }
  .g-actions { margin-top: 36px; display: flex; flex-wrap: wrap; gap: 14px; }
  .g-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 26px;
    border-radius: 999px;
    font-size: 14px;
    font-family: inherit;
    letter-spacing: 0.02em;
    text-decoration: none;
    cursor: pointer;
  }
  .g-primary { border: 0; background: var(--g-accent); color: var(--g-on-accent); }
  .g-secondary { border: 1px solid var(--g-line); background: transparent; color: var(--g-ink); }
  .g-id {
    margin: 32px 0 0;
    font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
    font-size: 11.5px;
    letter-spacing: 0.04em;
    color: var(--g-muted);
  }
  a:focus-visible, button:focus-visible { outline: 2px solid var(--g-accent); outline-offset: 3px; }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="g-wrap">
          <p className="g-label">Error</p>
          <h1 className="g-title">ページを表示できませんでした。</h1>
          <p className="g-text">
            一時的な不具合の可能性があります。もう一度お試しください。
          </p>
          <div className="g-actions">
            <button type="button" onClick={reset} className="g-btn g-primary">
              もう一度試す
            </button>
            {/* ここは next/link を使わない。アプリの土台ごと壊れている場面なので
                クライアント遷移ではなく フルリロードで確実にやり直させる。 */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="g-btn g-secondary">
              トップへ戻る
            </a>
          </div>
          {error.digest && <p className="g-id">エラーID: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
