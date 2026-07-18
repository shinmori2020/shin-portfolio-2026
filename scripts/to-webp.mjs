// Works 画像の WebP 変換スクリプト（開発用・ローカル手動実行のみ）。
//
// public/works/{slug}/{cover,full}.png を WebP へ変換する。
// 画像規約(src/lib/workImages.ts)は webp を最優先で探索するため 変換後は自動で切り替わる（コード変更不要）。
//
// !! サイト本体のランタイム/ビルド/バンドルには一切関与しない。sharp は next が依存として持つものを
//    借用しており このファイルは .mjs のため tsc の型検査対象・next のバンドル対象外。
//
// 使い方:
//   node scripts/to-webp.mjs              … 変換のみ（PNG は残す・変換結果を確認したい時）
//   node scripts/to-webp.mjs --delete-png … 変換後に元の PNG を削除する
//   node scripts/to-webp.mjs --quality=82 … 品質を指定（既定 80）
//   node scripts/to-webp.mjs --dry-run    … 変換せず対象と現在のサイズだけ表示
//
// 注意: 撮影(capture-works.mjs)と同様 npm 経由だとフラグが渡らない環境があるため node を直接叩くこと。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const WORKS_DIR = path.join(PROJECT_ROOT, 'public', 'works');

// ---- CLI 引数 ----
const args = process.argv.slice(2);
const deletePng = args.includes('--delete-png');
const dryRun = args.includes('--dry-run');
const quality = Number(args.find((a) => a.startsWith('--quality='))?.slice('--quality='.length) ?? 80);

if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
  console.error(`✗ --quality は 1〜100 の数値で指定してください（受け取った値: ${quality}）`);
  process.exit(1);
}

const fmtKB = (bytes) => `${(bytes / 1024).toLocaleString('en-US', { maximumFractionDigits: 0 })} KB`;

/** public/works 配下の cover.png / full.png を集める */
function collectTargets() {
  if (!fs.existsSync(WORKS_DIR)) return [];
  const out = [];
  for (const slug of fs.readdirSync(WORKS_DIR)) {
    const dir = path.join(WORKS_DIR, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const base of ['cover', 'full']) {
      const png = path.join(dir, `${base}.png`);
      if (fs.existsSync(png)) out.push({ slug, base, png, webp: path.join(dir, `${base}.webp`) });
    }
  }
  return out;
}

async function main() {
  const targets = collectTargets();
  if (targets.length === 0) {
    console.log('対象となる PNG がありません（public/works/{slug}/{cover,full}.png）。');
    return;
  }

  console.log(`WebP 変換: ${targets.length} 件 / quality=${quality}${dryRun ? ' / DRY-RUN' : ''}\n`);

  let beforeTotal = 0;
  let afterTotal = 0;
  const rows = [];

  for (const t of targets) {
    const before = fs.statSync(t.png).size;
    beforeTotal += before;

    if (dryRun) {
      rows.push({ name: `${t.slug}/${t.base}`, before, after: null });
      continue;
    }

    // effort:6 は sharp の既定(4)より高圧縮寄り。変換は手動実行なので時間より容量を優先する。
    await sharp(t.png).webp({ quality, effort: 6 }).toFile(t.webp);
    const after = fs.statSync(t.webp).size;
    afterTotal += after;
    rows.push({ name: `${t.slug}/${t.base}`, before, after });

    if (deletePng) fs.unlinkSync(t.png);
  }

  // ---- 結果表 ----
  const w = Math.max(...rows.map((r) => r.name.length));
  for (const r of rows) {
    if (r.after === null) {
      console.log(`  ${r.name.padEnd(w)}  ${fmtKB(r.before).padStart(10)}`);
    } else {
      const cut = ((1 - r.after / r.before) * 100).toFixed(1);
      console.log(
        `  ${r.name.padEnd(w)}  ${fmtKB(r.before).padStart(10)} → ${fmtKB(r.after).padStart(9)}  (-${cut}%)`
      );
    }
  }

  if (!dryRun) {
    const cut = ((1 - afterTotal / beforeTotal) * 100).toFixed(1);
    console.log(`\n合計: ${fmtKB(beforeTotal)} → ${fmtKB(afterTotal)}  (-${cut}%)`);
    console.log(deletePng ? '元の PNG は削除しました。' : '元の PNG は残しています（--delete-png で削除）。');
  }
}

main().catch((err) => {
  console.error('予期しないエラー:', err);
  process.exit(1);
});
