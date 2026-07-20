// Works サムネイル自動撮影スクリプト（開発用・ローカル手動実行のみ）。
//
// URL リスト(capture-list.mjs)から統一条件でファーストビューを撮影し
// 画像規約パス public/works/{slug}/cover.png へ保存する。
//
// !! サイト本体のランタイム/ビルド/バンドルには一切関与しない。playwright は devDependency で
//    本体には import されない。このファイルは .mjs のため tsc の型検査対象・next のバンドル対象外。
//
// 使い方:
//   npm run capture                 … capture-list.mjs の全案件を撮影（既定で上書き）
//   npm run capture -- --slug=foo   … slug=foo の1件だけ撮影
//   npm run capture -- --skip-existing … 既に cover.png がある案件はスキップ
//   npm run capture -- --list       … 撮影せず対象一覧だけ表示
//
// 事前準備（初回のみ）: npx playwright install chromium

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { targets } from './capture-list.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const WORKS_DIR = path.join(PROJECT_ROOT, 'public', 'works');

// ---- 撮影の統一条件（全案件共通・変更しないこと） ----
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;      // Retina 相当の解像度
const COLOR_SCHEME = 'light';       // ライト固定
// 既定は reduce（登場アニメ途中を写さない）。ただし背景アニメが常時動く案件では
// reduce が「崩れた中間状態」で凍結してしまうため 案件側の reducedMotion で上書きできる。
const REDUCED_MOTION = 'reduce';
const SAFETY_MARGIN_MS = 500;       // フォント/描画確定後の安全マージン
const NAV_TIMEOUT_MS = 30_000;      // 1件あたり上限（無限に待たない）

const REVEAL_SETTLE_MS = 600;       // reveal を確定させた後 再描画を待つ

// ---- CLI 引数 ----
const args = process.argv.slice(2);
const slugFilter = args.find((a) => a.startsWith('--slug='))?.slice('--slug='.length);
const skipExisting = args.includes('--skip-existing');
const listOnly = args.includes('--list');

const EXTS = ['webp', 'png', 'jpg', 'jpeg', 'avif']; // 規約の探索拡張子（既存判定用）

/** 出力ファイル名（未指定は cover.png）。full.png 用に out で上書きできる */
function outNameFor(target) {
  return target.out ?? 'cover.png';
}

/** その target の出力画像が既に存在するか（out の basename を全拡張子で確認） */
function hasExisting(target) {
  const base = path.parse(outNameFor(target)).name; // 'cover' / 'full'
  return EXTS.some((ext) => fs.existsSync(path.join(WORKS_DIR, target.slug, `${base}.${ext}`)));
}

/**
 * fullPage 撮影の前処理その1: ページ全体をゆっくりスクロールする。
 * 遅延読み込み(loading=lazy / クライアント取得)を誘発し 一度きりの reveal を発火させるのが狙い。
 */
async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const docHeight = () =>
      Math.max(document.body?.scrollHeight ?? 0, document.documentElement?.scrollHeight ?? 0);

    const step = Math.max(200, Math.round(window.innerHeight * 0.75));
    let y = 0;
    // 上限を設けpage伸長による無限ループを防ぐ
    for (let i = 0; i < 300 && y < docHeight(); i++) {
      window.scrollTo(0, y);
      await sleep(140); // reveal の発火と描画を待つ
      y += step;
    }
    window.scrollTo(0, docHeight());
    await sleep(400);
    window.scrollTo(0, 0);
    await sleep(300); // 先頭へ戻した後の再描画を待つ
  });
}

/**
 * fullPage 撮影の前処理その2（本命）: 画面外へ出て隠れ直した reveal を最終状態へ確定させる。
 *
 * Framer Motion の whileInView は once:true が無いと ビューポートを出た要素を opacity:0 へ戻す。
 * そのためスクロールで発火させても 先頭へ戻した時点で下部が再び隠れ 白紙のまま写る。
 * ここではその署名（インラインで opacity ほぼ0 かつ transform 付き）を持つ要素だけを対象に
 * インラインスタイルを最終状態へ上書きする。意図的に隠している要素（display:none や
 * transform 無しのオーバーレイ）は条件に合わないため巻き込まない。
 *
 * ビューポートを全高へ広げる案は 100vh 指定のヒーローが引き伸ばされるため不採用。
 */
async function settleRevealedState(page) {
  const fixed = await page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('[style*="opacity"]')) {
      const s = el.style;
      const op = parseFloat(s.opacity || '1');
      if (op < 0.5 && s.transform && s.transform !== 'none') {
        s.opacity = '1';
        s.transform = 'none';
        n++;
      }
    }
    return n;
  });
  if (fixed > 0) console.log(`    (画面外で隠れ直した reveal ${fixed} 件を表示状態へ確定)`);
  await page.waitForTimeout(REVEAL_SETTLE_MS);
}

/** 1件を撮影。成功時は保存パスを返し 失敗時は例外を投げる */
async function capture(browser, target) {
  const { slug, url, dismiss, waitMs = 0, fullPage = false, reducedMotion = REDUCED_MOTION } = target;
  const outDir = path.join(WORKS_DIR, slug);
  const outPath = path.join(outDir, outNameFor(target));

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: COLOR_SCHEME,
    reducedMotion,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(NAV_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT_MS });

    // 任意: Cookie バナー等を閉じる（無ければ黙って続行）
    if (dismiss) {
      try {
        await page.click(dismiss, { timeout: 3_000 });
      } catch {
        console.warn(`    (dismiss "${dismiss}" は見つからず・続行)`);
      }
    }

    // フォント確定を待つ（失敗しても致命ではない）
    await page.evaluate(() => document.fonts?.ready).catch(() => {});

    // 全景撮影のみ: reveal を発火させた状態を作ってから撮る（ファーストビューは表示済みのため不要）
    if (fullPage) {
      await scrollThroughPage(page);
      // スクロールで誘発した遅延読み込みの取得完了を待つ（失敗しても致命ではない）
      await page.waitForLoadState('networkidle').catch(() => {});
      await settleRevealedState(page);
    }

    if (waitMs > 0) await page.waitForTimeout(waitMs);
    await page.waitForTimeout(SAFETY_MARGIN_MS);

    fs.mkdirSync(outDir, { recursive: true });
    await page.screenshot({ path: outPath, fullPage, type: 'png' });

    return path.relative(PROJECT_ROOT, outPath);
  } finally {
    await context.close();
  }
}

async function main() {
  let queue = targets;
  if (slugFilter) {
    queue = targets.filter((t) => t.slug === slugFilter);
    if (queue.length === 0) {
      console.error(`✗ slug="${slugFilter}" は capture-list.mjs に見つかりません。`);
      process.exit(1);
    }
  }

  if (listOnly) {
    console.log(`撮影対象 ${queue.length} 件:`);
    for (const t of queue) console.log(`  - ${t.slug.padEnd(20)} → ${outNameFor(t).padEnd(10)} ${t.url}`);
    return;
  }

  console.log(
    `Works 撮影開始: ${queue.length} 件 / ${VIEWPORT.width}x${VIEWPORT.height}@${DEVICE_SCALE_FACTOR}x` +
      ` / ${COLOR_SCHEME} / reduced-motion:${REDUCED_MOTION}\n`
  );

  const browser = await chromium.launch();
  const ok = [];
  const failed = [];

  try {
    for (const target of queue) {
      const { slug, url } = target;
      if (skipExisting && hasExisting(target)) {
        console.log(`- ${slug}: 既存カバーありスキップ`);
        continue;
      }
      process.stdout.write(`… ${slug}: ${url}\n`);
      try {
        const rel = await capture(browser, target);
        ok.push({ slug, rel });
        console.log(`  ✓ ${rel}`);
      } catch (err) {
        const reason = err instanceof Error ? err.message.split('\n')[0] : String(err);
        failed.push({ slug, url, reason });
        console.error(`  ✗ 失敗: ${reason}`);
      }
    }
  } finally {
    await browser.close();
  }

  // ---- サマリ ----
  console.log(`\n===== 結果 =====`);
  console.log(`成功: ${ok.length} 件 / 失敗: ${failed.length} 件`);
  for (const s of ok) console.log(`  ✓ ${s.slug}  → ${s.rel}`);
  if (failed.length > 0) {
    console.log(`\n失敗一覧:`);
    for (const f of failed) console.log(`  ✗ ${f.slug}  ${f.url}\n      理由: ${f.reason}`);
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('予期しないエラー:', err);
  process.exit(1);
});
