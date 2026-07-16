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
const REDUCED_MOTION = 'reduce';    // 登場アニメ途中を写さない
const SAFETY_MARGIN_MS = 500;       // フォント/描画確定後の安全マージン
const NAV_TIMEOUT_MS = 30_000;      // 1件あたり上限（無限に待たない）

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

/** 1件を撮影。成功時は保存パスを返し 失敗時は例外を投げる */
async function capture(browser, target) {
  const { slug, url, dismiss, waitMs = 0, fullPage = false } = target;
  const outDir = path.join(WORKS_DIR, slug);
  const outPath = path.join(outDir, outNameFor(target));

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    colorScheme: COLOR_SCHEME,
    reducedMotion: REDUCED_MOTION,
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
