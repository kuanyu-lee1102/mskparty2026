# 接棒文件 — 2026 惠歆音樂會網站

最後更新：2026-05-05（Wave 4 完成）

這份文件給「下一個開工的 session（人或 Claude）」用 — 看完這份就能無縫接手。

---

## 一、目前進度（5 個 Wave）

| Wave | 範圍 | Commit | 狀態 |
|---|---|---|---|
| 1 | Vite + React 19 + react-router-dom 7 + Vitest scaffold；CSS tokens；404 SPA hack；Google Fonts；6 個公開素材 | `90064d8` | ✅ |
| 2 | 共用 UI：MapButton / PlaceholderBox / ImageLightbox / ScheduleImageGallery（含 lightbox 放大 bug 修正、lost button 改內容寬度） | `b61e3a1` + `80e8fad` | ✅ |
| 3 | HomePage（含 logo + 植物角落裝飾）、EventHero、SectionNav（auto-margin 中央對齊）、ContactSection | `ded6a58` | ✅ |
| 4 | DounanVenueSection / ScheduleSection / ProgramSection / ProgramAccordion；ZhubeiVenueSection / ScheduleSection / ProgramSection；programSearch.js + 24 unit tests；老師色彩系統 | `1a03177` | ✅ |
| 5 | 頁面組裝（DounanPage / ZhubeiPage 正式版）、`vite.config.js` 部署 base、GitHub Actions deploy.yml | — | ⏳ 未開始 |

`main` branch 已 push 到 GitHub，最新 commit `1a03177`。

---

## 二、下一步：Wave 5（Agent F）

### 工作範圍

| 檔案 | 內容 |
|---|---|
| `src/pages/DounanPage.jsx` | 目前是「Wave 4 預覽版」串接所有 Section，可保留或重寫，內容已正確 |
| `src/pages/ZhubeiPage.jsx` | 同上 |
| `vite.config.js` | 已設 `base: command === 'build' ? '/mskparty2026/' : '/'`，**已可用** — Agent F 主要驗證/微調即可 |
| `.github/workflows/deploy.yml` | **需新建** — GitHub Actions 自動 build + deploy gh-pages |

### Wave 5 重點

1. **Page 組裝**：目前 `DounanPage.jsx` / `ZhubeiPage.jsx` 已實際串好所有 Section，視覺與互動都驗證過 — 可能不需大改，只需最後檢查 SectionNav tab id 與 section id 對齊、`<main>` 包裝、SEO meta（如有需要）。
2. **GitHub Pages 部署**：
   - Repo: `https://github.com/kuanyu-lee1102/mskparty2026`
   - Base path: `/mskparty2026/`
   - Workflow：node setup → `npm ci` → `npm run build` → 上傳 `dist/` 到 `gh-pages` branch（或用 `actions/deploy-pages@v4` 走 Pages artifact 流程）
   - Settings > Pages source 要設成 `gh-pages` branch 或 `GitHub Actions`
3. **404.html SPA hack**：Wave 1 已建好，`pathSegmentsToKeep = 1`（對應 `/mskparty2026/` 一段）。直接訪問 `/mskparty2026/dounan` 應透過 hack 正常運作。

### 啟動 Agent F 的建議 prompt 框架

```
你是 Wave 5 的 Agent F，負責頁面正式組裝 + GitHub Pages 部署。

工作目錄：/Users/kuan-yu/Documents/2026 音樂會
必讀：
- SESSION_HANDOFF.md（這份）
- CLAUDE_CODE_FRONTEND_HANDOFF.md 頁面模型段
- engineering-plan.md
- event-website-spec.md 整體頁面結構段
- project-progress.md
- 現有 src/pages/DounanPage.jsx / ZhubeiPage.jsx（已預組裝，可大幅復用）
- vite.config.js（base 已設定）

工作規範同 plan 第 10.1 節（規格優先、不過度猜測、缺資料用 PlaceholderBox）。
依賴：Wave 1-4 全部產出，只讀不改。

產出：
- src/pages/DounanPage.jsx 正式版（若預覽版已 OK 可不大改）
- src/pages/ZhubeiPage.jsx 正式版
- .github/workflows/deploy.yml 新增

完成後 npm run build 必須通過，npx vitest run 必須通過。
```

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
| D10 | 節目卡只顯示「序號/演出者/曲目」，不顯示 `type` | — | 待確認 |
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

- **`data/contacts.json` 的 Facebook value 是 `Museek Soul`**（中間有空格），但 `data/events.json` `brand.englishName` 是 `Museeksoul`（無空格）。需要使用者決定哪個是正確拼寫，並更新對應 JSON。

### 規格 / JSON 待補（不影響網站運作，PlaceholderBox 已處理）

- 竹北節目表說明文字（`ZhubeiProgramSection` 顯示「節目表說明待補」）
- 部分老師的 `items` 仍有 `performer: ''` / `title: ''` → 顯示為「— / 曲目待補」

> 註：`venue.zhubei.json` 已重構為 `heroImages` / `parkingInfo` / `entryFlows` 結構，
> 文字與圖片皆已備齊（依 `ZHUBEI_VENUE_UX_HANDOFF.md`），不再有 `arrivalSteps` 待補項目。

這些待補項目都在 JSON 補齊資料後，元件會自動顯示真內容，**不需要改程式碼**。

---

## 四、技術債 / 可選清理（低優先）

1. **DounanVenueSection.module.css 有 dead code**：
   - `.infoCard, .infoRow, .infoLabel, .infoValue, .code`（座標卡 styles，已不再 import）
   - `.notes, .notesTitle, .notesList, .notesItem`（抵達建議 styles，已不再 import）
   - 可順手刪。
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

## 六、計畫文件位置

執行計畫：`/Users/kuan-yu/.claude/plans/rippling-juggling-starfish.md`

該檔包含：
- 12 小節完整實作計畫
- 第 10.1「Agent 共通工作規範」（規格優先、不過度猜測、缺資料用 PlaceholderBox 等 8 條）
- 第 10.2「執行順序原則」（Wave 制 + 同 Wave 內檔案不重疊才並行）
- 第 10.3 / 10.4 各 Wave 的 Agent 範圍與必讀清單

---

## 七、規格文件清單（給 Wave 5 Agent F 必讀）

| 文件 | 重要段落 |
|---|---|
| `CLAUDE_CODE_FRONTEND_HANDOFF.md` | 頁面模型、元件對照、Do Not 規則 |
| `event-website-spec.md` | 整體頁面結構（先讀「頁面結構」段） |
| `engineering-plan.md` | 路由、檔案結構、部署 |
| `visual-style-guide.md` | 視覺基準（已被 Wave 1-4 落地實作） |
| `project-progress.md` | Do Not Override 規則 |

---

## 八、聯絡 / 驗證資源

- GitHub repo: https://github.com/kuanyu-lee1102/mskparty2026
- 部署網址（待 Wave 5）：`https://kuanyu-lee1102.github.io/mskparty2026/`
- 本機 dev：`http://localhost:5173/`

---

## 九、給接棒者的話

- **不要 hardcode 任何文案** — 一律從 JSON 讀
- **不要編造資料** — 缺的用 `PlaceholderBox`
- **遇到不確定** — 先回查規格 .md，找不到就問使用者
- **先 commit 再做大改動** — 已建立 Wave 制就遵守，避免 cross-wave 覆蓋
- **HMR 在背景跑時，視覺修改可即時驗證** — 善用瀏覽器
