# 接棒文件 — 2026 惠歆音樂會網站

最後更新：2026-05-11（斗南場場地資訊對齊竹北場視覺）

這份文件給「下一個開工的 session（人或 Claude）」用 — 看完這份就能無縫接手。

---

## 一、目前進度（5 個 Wave + 視覺優化）

| Wave | 範圍 | 狀態 |
|---|---|---|
| 1 | Vite + React 19 + react-router-dom 7 + Vitest scaffold；CSS tokens；404 SPA hack；Google Fonts；6 個公開素材 | ✅ |
| 2 | 共用 UI：MapButton / PlaceholderBox / ImageLightbox / ScheduleImageGallery | ✅ |
| 3 | HomePage（含 logo + 植物角落裝飾）、EventHero、SectionNav、ContactSection | ✅ |
| 4 | DounanVenueSection / ScheduleSection / ProgramSection / ProgramAccordion；ZhubeiVenueSection / ScheduleSection / ProgramSection；programSearch.js + 24 unit tests；老師色彩系統 | ✅ |
| 5 | 頁面組裝、`.github/workflows/deploy.yml`（actions/deploy-pages@v4 OIDC）、GitHub Pages 部署、CLAUDE.md 開發準則、`.gitignore` secrets 防護 | ✅ |
| Round 1 | **竹北場 venue 依 `ZHUBEI_VENUE_UX_HANDOFF.md` 重做**：Hero（Le Phare 室內）/ 場地摘要置中 / Google Maps / 停車 collapsible（含 car icon、副標、◇ 菱形列點注意事項）/ Radio segmented buttons 入場分流 / 米色 wrapper banner 包 step 卡 / 自行換證入場新增「請至櫃檯辦理換證」首步驟。EventHero 副標移除（首頁仍保留） | ✅ |
| Round 2 | **斗南節目編輯流程 + items[] schema 簡化**：新增 `scripts/programs-to-csv.mjs`（CSV ↔ JSON 契約寫在 docstring）；協作者第二輪 CSV 改回 JSON（含曲目、姓名拼字、Mr. Vincent 老師名統一為「林老師」）；items 移除 `performers[]` 與 `type`，只保留 `order / performer / title`；團班顯示靠 `(團名) 名1、名2` 約定，`ProgramAccordion` 解析後渲染標籤 + 編號學生名單；mobile header padding/gap/teacher font 微調讓 `Miss. Khristin 黃老師` 單行可塞下 | ✅ |
| Round 3 | **斗南場場地資訊整體對齊竹北場視覺**（2026-05-11）：標題置中 + ◇ 菱形分隔；新增 hero（眷村景觀 cover 圖）置於分隔線下；摘要置中大字 venueShortName + 「venueName｜displayAddress」；新增「會場地點」米色卡（朱紅 pin icon + 標題 + 摘要 + 縮小引導圖 + 紅菱形 captionList）；引導圖換為紅圈標示版（`dounan-venue-area-circled.jpg`）；地圖按鈕只剩單顆「用 Google 地圖帶我去會場！」（移除 Apple Maps）；`displayAddress` 更新為正式地址 | ✅ |

線上：**https://kuanyu-lee1102.github.io/mskparty2026/**
GitHub repo：https://github.com/kuanyu-lee1102/mskparty2026（public）

---

## 二、下一步候選

候選任務（順序非強制，按需要排）：

1. **斗南場視覺驗收 + 文案決策**：見第三節「Agent D / E 尚待決定」
2. **竹北 venue 視覺最終驗收**：第一輪結構升級已上線，等使用者跑最後一輪 device 測試
3. **第二輪視覺優化（選做）**：依 `ZHUBEI_VENUE_UX_HANDOFF.md` / 示意圖補強，可能項目：
   - 入場 segmented buttons icon 改 filled silhouette
   - 加頁角植物 / 鋼琴線稿裝飾（需先取得 SVG 素材）
   - Google Maps 按鈕加 pin icon
4. **節目表下一輪編輯 / 回灌**：流程已就緒。重新匯出用 `node scripts/programs-to-csv.mjs`，CSV ↔ JSON 契約寫在 script 開頭 docstring（含「老師欄定位」「列順序 = items 順序」「團班 `(團名) 名1、名2` 約定」「序號前導零」等規則）。
5. **未補資料**：竹北節目表說明文字（斗南場 performer / title 已於 2026-05-10 由協作者 CSV 補齊）

---

## 三、使用者尚未檢驗的項目（待你下次回來時確認）

### 斗南場
- [ ] 節目表新配色實際逐一 accordion 點開檢查（每位老師對應的色彩、序號徽章、展開後的 8% pastel fill）
- [ ] 搜尋實際操作：輸入「Candy」「卡儂」「王XX」測試 blur / Enter / 清空 / 無結果
- [ ] DounanVenueSection 移除座標卡 + 抵達建議後的整體配置是否仍順
- [ ] DounanScheduleSection 圖片放大 lightbox

### 竹北場
- [x] ZhubeiVenueSection 已依 `ZHUBEI_VENUE_UX_HANDOFF.md` 重做（hero 兩張、Le Phare/暐順經貿大樓/地址、Google Maps、停車 collapsible、Radio cards 入場分流、流程步驟） — **待視覺驗證**
- [ ] ZhubeiScheduleSection：時間表圖
- [ ] ZhubeiProgramSection：單張節目表圖 + 點擊放大 + 「節目表說明待補」

### Agent D / E 提出但尚未逐項評估的設計決策

#### Agent D（斗南）尚待決定
| # | 項目 | 目前 | 備註 |
|---|---|---|---|
| D1 | VenueSection「抵達建議」標題文字 | 已移除整段 | 已處理 ✓ |
| D2 | 座標卡 dt label | 已移除整段 | 已處理 ✓ |
| D3 | Accordion 標題用 `teacherDisplayName` | 例：「Miss. Candy 蔡老師」 | 待確認 |
| D4 | 搜尋 placeholder | 「例如：王大明、卡儂、Candy 蔡老師」 | 已調整 ✓ |
| D5 | 搜尋輔助文字 | 「輸入後按 Enter 或點其他地方即可搜尋」 | 待確認 |
| D6 | LostSection 引言 / 標籤 | LostSection 已移除 | 已處理 ✓ |
| D8 | 曲目空字串顯示 | 「曲目待補」 | 待確認 |
| D9 | session 標題加開始時間 | 例：「上午場 10:00 起」 | 待確認 |
| D10 | 節目卡只顯示「序號/演出者/曲目」，不顯示 `type` | items[] schema 已移除 `type` / `performers[]`，只剩 `order / performer / title` | 已處理 ✓ |
| D11 | VenueSection 顯示 `primaryGoal` 小字 | 「協助使用者抵達虎尾建國眷村後，找到園區內指定的 C 區草地會場。」 | 待確認 |

#### Agent E（竹北）尚待決定
| # | 項目 | 目前 | 備註 |
|---|---|---|---|
| E1 | 步驟序號補零 | 「01 / 02」（每流程獨立計數） | 已調整 ✓ |
| E2 | 序號樣式 | 朱紅底白字膠囊 | 沿用 ✓ |
| E3 | 摘要卡 vs 步驟卡背景 | 已重構：摘要無框、步驟卡 `--bg-white` | 已處理 ✓ |
| E4 | Google Maps 按鈕文字 | 「用 Google 地圖開啟」 | 沿用 ✓ |
| E5 | 節目表說明 PlaceholderBox tone | `info`，其他「待補」`pending` | 待確認（不影響竹北 venue） |

### 資料層待修正（不影響 build）

- 已處理 ✓：拼寫已統一為 `Museeksoul`；`contacts.json` 已加 Instagram、移除 LINE ID、Facebook 拆主粉專與竹北教室。

### 規格 / JSON 待補（不影響網站運作，PlaceholderBox 已處理）

- 竹北節目表說明文字（`ZhubeiProgramSection` 顯示「節目表說明待補」）
- 部分老師的 `items` 仍有 `performer: ''` / `title: ''` → 顯示為「— / 曲目待補」

> 註：`venue.zhubei.json` 已重構為 `heroImages` / `parkingInfo` / `entryFlows` 結構，
> 文字與圖片皆已備齊（依 `ZHUBEI_VENUE_UX_HANDOFF.md`），不再有 `arrivalSteps` 待補項目。

這些待補項目都在 JSON 補齊資料後，元件會自動顯示真內容，**不需要改程式碼**。

---

## 四、技術債 / 可選清理（低優先）

1. ~~**DounanVenueSection.module.css 有 dead code**~~：已於 2026-05-11 重寫整支檔案，dead 樣式皆已清除。
2. **首頁 plant-ornament.png** 是螢幕截圖，目前用 `mix-blend-mode: darken` 融背景。如果要更乾淨可改用真正去背過的 SVG / PNG。
3. **首頁 Museeksoul logo** 用 `mix-blend-mode: multiply` 處理白底，整體可接受。若想完全去背可請 designer 提供透明 PNG/SVG。
4. **資料路徑轉換** `assetUrl()` 目前只處理 `source-materials/` 前綴。HomePage 對 logo / plant 用 `import.meta.env.BASE_URL + 'assets/brand/...'` 直接拼接（因為它們不在 source-materials 裡）。沒問題但兩種 pattern 並存。

---

## 五、開發指令備忘

```bash
cd "/Users/kuan-yu/Documents/2026 音樂會"

npm run dev          # http://localhost:5173/
npm run build        # 產出 dist/，base 自動套 /mskparty2026/
npm run preview      # 預覽 build 結果
npx vitest run       # 跑單元測試（目前 24 tests，全綠）
```

開發中如果 dev server 已在背景跑，HMR 會自動反映變更，**通常不需要重啟**。
若 dev server 死了：`npm run dev > /tmp/vite-dev.log 2>&1 &`，然後 `head -10 /tmp/vite-dev.log` 確認。

---

## 六、規格文件清單

| 文件 | 重要段落 |
|---|---|
| `CLAUDE.md` | 任何 AI 動工前必讀；安全規則 + 開發規則 + 必讀文件順序 |
| `CLAUDE_CODE_FRONTEND_HANDOFF.md` | 頁面模型、元件對照、Do Not 規則 |
| `event-website-spec.md` | 整體頁面結構 |
| `engineering-plan.md` | 路由、檔案結構、部署 |
| `visual-style-guide.md` | 視覺基準 |
| `project-progress.md` | Decision Log + Do Not Override + Verification Notes |
| `ZHUBEI_VENUE_UX_HANDOFF.md` | 竹北 venue UX、停車、入場分流、圖片對應 |

---

## 七、聯絡 / 驗證資源

- GitHub repo: https://github.com/kuanyu-lee1102/mskparty2026（public）
- 部署網址：https://kuanyu-lee1102.github.io/mskparty2026/
- 本機 dev：`npm run dev` → `http://localhost:5173/`
- 本機 preview build：`npm run build && npm run preview` → `http://localhost:4173/mskparty2026/`

---

## 八、給接棒者的話

- **不要 hardcode 任何文案** — 一律從 JSON 讀
- **不要編造資料** — 沒對應素材就不放（竹北 venue 規範）；其他區塊缺資料用 `PlaceholderBox`
- **遇到不確定** — 先回查規格 .md，找不到就問使用者
- **commit 前跑 `npx vitest run`**
- **HMR 在背景跑時，視覺修改可即時驗證** — 善用瀏覽器
- **public repo**：絕對不要 commit secret（API keys、tokens、私鑰），詳見 CLAUDE.md
