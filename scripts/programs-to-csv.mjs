#!/usr/bin/env node
/**
 * 把 data/programs.dounan.json 攤平成 CSV，給曲目表負責人在 Google Sheets 編輯。
 * 改完後再以 CSV 回灌 JSON，因此本檔同時定義匯出與回灌（CSV ↔ JSON）的契約。
 *
 * ── CSV 欄位 ───────────────────────────────────────────
 *   場次       顯示用，從 program 層級展開到每一列
 *   顯示於老師 顯示用 + 定位用，對應 programs[].teacherDisplayName（13 位皆唯一）；
 *              代表這一列會出現在哪一位老師的 accordion / 時段裡。
 *   指導老師   可留空。若某位老師的學生插入另一位老師時段，填原指導老師；
 *              對應 items[].ownerTeacherDisplayName，前端會顯示「某老師學生」標籤。
 *   時段       顯示用，從 program 層級展開到每一列
 *   序號       items[].order（字串，可重複，不當 key）
 *   演出者     items[].performer — 顯示字串就是唯一事實來源，個別姓名要寫進這欄。
 *              獨奏：「郭芊妤」；多人：「林永昕 & Vincent」「劉姷汘、劉芛辰、劉洧岓」；
 *              團班：「(鍵盤團班) 何禹昕、高荺晴、施柏安、劉采恩、王若宏」（前綴標註團名）。
 *   曲目       items[].title
 *
 * ── 對應策略（CSV → JSON）─────────────────────────────
 *   items[] 在原 JSON 沒有穩定 id，順序就是位置決定的，所以回灌時直接 rebuild：
 *   1. 用「顯示於老師」欄（teacherDisplayName）對到 program。
 *   2. 同一位「顯示於老師」底下的列 → 該 program 的 items[]，CSV 列順序 = 新順序。
 *   3. 每列組成 item：{ order, performer, title }；若「指導老師」有值，另加
 *      ownerTeacherDisplayName。不寫 performers / type 欄位。
 *   4. program 層級欄位（session / teacher.../ startTime / endTime / sourceImage）
 *      不從 CSV 取，維持原 JSON。
 *
 * ── 回灌前必須驗證（AI checklist）─────────────────────
 *   - CSV 出現的所有「顯示於老師」與非空「指導老師」都能在原 JSON 找到 → 否則報錯（拼錯或誤改）
 *   - 原 JSON 的所有老師都在 CSV 出現 → 否則警告（整段被刪要先確認）
 *   - 允許「指導老師」插入不同「顯示於老師」的時段；這是正式支援的跨老師演出順序調整。
 *   - 同一位「顯示於老師」的列仍建議連續出現，維持 accordion 易讀。
 *   - 序號欄位不影響 items[] 順序（順序看 CSV 列順序），僅作為顯示標籤保留。
 *   - Google Sheets 可能把序號 "01" 自動轉成 1，回灌時若發現純數字序號變短，
 *     可選擇補回前導零（與原 JSON 對照）或維持 CSV 值，視情況決定並回報。
 *   - 團班 / 多人合奏的「演出者」欄要包含每個人的姓名（substring 搜尋會吃這欄），
 *     若顯示字串只有團名而無個別姓名 → 警告（會搜不到個別學生）。
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
  '顯示於老師',
  '指導老師',
  '時段',
  '序號',
  '演出者',
  '曲目',
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
      item.ownerTeacherDisplayName || '',
      slot,
      item.order,
      item.performer,
      item.title,
    ]);
  }
}

const BOM = '﻿';
const csv = BOM + rows.map((r) => r.map(csvEscape).join(',')).join('\r\n') + '\r\n';

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, csv, 'utf8');
console.log(`Wrote ${rows.length - 1} rows to ${path.relative(ROOT, OUT)}`);
