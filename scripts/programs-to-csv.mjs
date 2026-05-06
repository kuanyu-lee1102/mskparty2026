#!/usr/bin/env node
/**
 * 把 data/programs.dounan.json 攤平成 CSV，給曲目表負責人在 Google Sheets 編輯。
 * 改完後再以 CSV 回灌 JSON，因此本檔同時定義匯出與回灌（CSV ↔ JSON）的契約。
 *
 * ── CSV 欄位 ───────────────────────────────────────────
 *   場次          顯示用，從 program 層級展開到每一列
 *   老師          顯示用 + 定位用，對應 programs[].teacherDisplayName（13 位皆唯一）
 *   時段          顯示用，從 program 層級展開到每一列
 *   序號          items[].order（字串，可重複，不當 key）
 *   演出者        items[].performer（顯示字串，可包含「、」「& 老師名」等）
 *   演出者列表    items[].performers，用 `|` 分隔；獨奏留空
 *   曲目          items[].title
 *   類型          items[].type — 空白＝獨奏，其他值：group / ensemble / family
 *
 * ── 對應策略（CSV → JSON）─────────────────────────────
 *   items[] 在原 JSON 沒有穩定 id，順序就是位置決定的，所以回灌時直接 rebuild：
 *   1. 用「老師」欄（teacherDisplayName）對到 program。
 *   2. 同一位老師連續出現的列 → 該 program 的 items[]，CSV 列順序 = 新順序。
 *   3. 每列直接組成 item：演出者列表為空就不寫 performers；類型為空就不寫 type。
 *   4. program 層級欄位（session / teacher.../ startTime / endTime / sourceImage）
 *      不從 CSV 取，維持原 JSON。
 *
 * ── 回灌前必須驗證（AI checklist）─────────────────────
 *   - CSV 出現的所有「老師」都能在原 JSON 找到 → 否則報錯（拼錯或誤改）
 *   - 原 JSON 的所有老師都在 CSV 出現 → 否則警告（整段被刪要先確認）
 *   - 同一位老師的列必須連續出現 → 否則報錯（避免被穿插切開）
 *   - 「類型」與「演出者列表」一致性檢查：
 *       · 類型 ∈ {group, ensemble} 但演出者列表只有一人或為空 → 警告
 *       · 類型為空（獨奏）但演出者列表有多人 → 警告
 *   - 序號欄位不影響 items[] 順序（順序看 CSV 列順序），僅作為顯示標籤保留。
 *   - Google Sheets 可能把序號 "01" 自動轉成 1，回灌時若發現純數字序號變短，
 *     可選擇補回前導零（與原 JSON 對照）或維持 CSV 值，視情況決定並回報。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'programs.dounan.json');
const OUT = path.join(ROOT, 'exports', 'programs.dounan.csv');

const HEADERS = [
  '場次',
  '老師',
  '時段',
  '序號',
  '演出者',
  '演出者列表',
  '曲目',
  '類型',
];

function csvEscape(value) {
  if (value == null) return '';
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

const json = JSON.parse(await readFile(SRC, 'utf8'));
const rows = [HEADERS];

for (const program of json.programs) {
  const slot = `${program.startTime}–${program.endTime}`;
  for (const item of program.items) {
    rows.push([
      program.session,
      program.teacherDisplayName,
      slot,
      item.order,
      item.performer,
      item.performers ? item.performers.join('|') : '',
      item.title,
      item.type ?? '',
    ]);
  }
}

const BOM = '﻿';
const csv = BOM + rows.map((r) => r.map(csvEscape).join(',')).join('\r\n') + '\r\n';

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, csv, 'utf8');
console.log(`Wrote ${rows.length - 1} rows to ${path.relative(ROOT, OUT)}`);
