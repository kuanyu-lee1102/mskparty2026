# Project Progress

## AI Handoff Pattern

每次由 AI 接手或完成一輪變更時，請先更新本文件，再繼續下一步。目標是讓下一位 AI 能在 3 分鐘內理解目前狀態、決策脈絡與不可踩的線。

建議更新順序：

1. **Decision Log**：只記已定案的決策，不記討論過但未採用的想法。每項決策需包含「結論」與「原因 / 風險」。
2. **Current Source of Truth**：標明目前應讀哪些檔案，不讓 AI 從舊檔名、舊路徑或圖片猜測需求。
3. **Do Not Override**：列出已經討論過、不可被後續實作覆蓋的規則。
4. **Open Questions**：列出仍需人類確認的事項，避免 AI 自行編造。
5. **Next Action**：只列 1-5 個下一步，保持可執行。
6. **Verification Notes**：記錄已跑過的檢查、是否 commit、工作樹是否乾淨。

寫法原則：

- 用繁體中文描述使用者可見需求；工程檔名、路由、元件名維持英文。
- 每次更新要保留「為什麼這樣決定」，不要只寫結果。
- 若需求有歧義，先寫成 open question，不要默默替使用者決定。
- 若有新資料檔成為規格來源，必須在 Current Source of Truth 更新。
- 不要把「場地資訊」、「時間表」、「節目表」混為同一區塊。

---

## Current Source of Truth

- `event-website-spec.md`：活動網站主要需求規格
- `engineering-plan.md`：工程架構與部署規劃
- `data/events.json`：全站品牌、活動名稱、場次路由與資料檔索引
- `data/venue.dounan.json`：斗南場場地資訊
- `data/venue.zhubei.json`：竹北場場地資訊
- `data/contacts.json`：聯絡資訊
- `data/programs.dounan.json`：斗南場節目表資料
- `data/schedules.public.json`：斗南 / 竹北公開版時間表圖片設定
- `visual-style-guide.md`：最新視覺方向與 UI 設計規範
- `ZHUBEI_VENUE_UX_HANDOFF.md`：竹北場場地資訊 UX、接待流程、停車資訊與圖片對應的詳細交接文件
- `gemini-visual-prompt.md`：依最新視覺方向整理的視覺生成提示
- `source-materials/`：整理後的素材來源資料夾
- `mockups/`：節目表搜尋與 accordion 視覺參考

## Current Progress

### Committed Checkpoints

- `2376530 Organize event site planning assets`
  - 將中文檔名、資料夾、LINE 匯出圖檔改成英文命名。
  - 更新 JSON 與文件中的素材路徑。
  - 收斂技術方案、路由與命名規則。

- `8b02668 Refine venue and schedule planning`
  - 新增 `data/schedules.public.json`。
  - 明確切分場地資訊、時間表、節目表。
  - 定義竹北場商辦內部場地資訊策略。
  - 定義時間表直接呈現圖片，不重建 timeline。

### Confirmed Decisions

1. **Tech Stack**
   - 使用 `Vite + React`。
   - 不使用純 HTML / CSS / JS 作為第一版主實作。

2. **Routes**
   - `/`：首頁
   - `/dounan`：斗南場
   - `/zhubei`：竹北場
   - 使用正常路由，不用 hash route。
   - 部署目標以 Cloudflare Pages 為主，需處理 SPA fallback。

3. **Naming**
   - 使用者介面顯示「斗南場」、「竹北場」。
   - 主標題與首頁按鈕不包含日期。
   - 程式、資料、元件命名使用 `dounan` / `zhubei`。
   - 網頁顯示文字使用繁體中文；工程檔名與資料夾使用英文。

4. **Assets**
   - 已有素材直接使用；未確認內容才使用 placeholder。
   - 實作時需將需要用的素材複製到 `public/assets` 或等效公開資產資料夾。
   - 不直接引用 `source-materials/...` 作為正式前端路徑。

5. **Venue vs Schedule**
   - 場地資訊與時間表是不同區塊，不可互相取代。
   - 時間表圖片不可用來取代場地資訊。
   - 場地資訊需依 `DounanVenueSection` / `ZhubeiVenueSection` 規格獨立實作。

6. **Dounan Venue**
   - 使用 `DounanVenueSection`。
   - 戶外園區 / 草地會場導引。
   - 使用 `data/venue.dounan.json`。
   - 保留「我迷路了」功能與 Google / Apple Maps 按鈕。

7. **Zhubei Venue**
   - 使用 `ZhubeiVenueSection`。
   - 商辦內部抵達流程，文字配圖。
   - 使用 `data/venue.zhubei.json`。
   - 詳細 UX 與圖片對應以 `ZHUBEI_VENUE_UX_HANDOFF.md` 為準。
   - 參考樣式為 `source-materials/zhubei/venue/竹北場地資訊示意圖.png`。
   - 商辦 / 商場正式名稱為「暐順經貿大樓」。
   - 正式地址為「新竹縣竹北市復興三路二段168號 9號樓之5室」。
   - Google Maps 連結為 `https://maps.app.goo.gl/n4jS88sTgs6sUhNe7`。
   - 竹北場不需要 Apple Maps 連結。
   - 場地摘要包含 Google Maps 圖或座標、商場地址；停車資訊放在 Google Maps 按鈕下方並預設收合。
   - 入場方式分為「工作人員接待」與「自行換證入場」，預設顯示「工作人員接待」。
   - 只顯示使用者所選的必要流程，不同時攤開兩條完整流程。
   - 不顯示「我迷路了」。
   - 若無對應截圖，請勿擅自創造不存在的圖片，也不要顯示缺圖 placeholder。
   - 入口、換證、樓層、出電梯後指引不可從圖片或常識自行編造。
   - 缺資料時顯示「待補」，不可自行編造樓層、換證規則或動線細節。
   - **實作落地（2026-05-06）**：
     - JSON 結構：`heroImages` / `parkingInfo` / `entryFlows`（取代舊的 `arrivalSummary` / `arrivalSteps`）。
     - 場地摘要用兩張 hero 圖並排（Le Phare 室內 + 大樓外觀）+ `venueShortName` + `venueName` + `displayAddress`。
     - 停車資訊以 inline collapsible 呈現（不重用 ProgramAccordion，避免不必要耦合）。
     - 入場分流選擇器使用 Radio cards（兩張並排大卡，附摘要文字），預設選中 staffReception。
     - 圖片均整合 ImageLightbox 點擊放大。

8. **Schedule**
   - 使用 `DounanScheduleSection` / `ZhubeiScheduleSection`。
   - 資料來源為 `data/schedules.public.json`。
   - 直接呈現公開參加者版時間表圖片，不另外拆資料重做 timeline 或卡片。
   - 斗南場公開網站只顯示 `source-materials/dounan/schedule/dounan-schedule-participant.jpg`。
   - 竹北場公開網站只顯示 `source-materials/zhubei/schedule/zhubei-schedule-participant.jpg`。
   - 老師版時間表改名為 `source-materials/dounan/schedule/dounan-schedule-teacher.jpg` 與 `source-materials/zhubei/schedule/zhubei-schedule-teacher.jpg`，只保留為素材，不顯示於公開網站。
   - 圖片需可點擊放大，使用 lightbox / modal，並提供明顯關閉按鈕。
   - Lightbox 不需要左右切換圖片，不需要下載圖片按鈕。
   - 圖片 caption 貼齊原本圖片用途，不另外加正式文案。
   - 工作人員與老師內部流程不放網站，另外在工作 LINE 群發布。

9. **Programs**
   - 斗南場使用 `data/programs.dounan.json`，並視為第一版正式資料。
   - 斗南場節目表需支援 accordion 與搜尋。
   - 斗南場 accordion 預設全部收起。
   - 搜尋範圍包含老師、學生、曲目，搜尋在 input blur 後執行，不做即時搜尋。
   - 搜尋結果只顯示符合搜尋條件的節目卡片，不保留完整 accordion。
   - 竹北場節目表只呈現圖片 `source-materials/zhubei/programs/zhubei-program-sheet-01.png`。
   - 竹北場節目表不做 JSON、不做 accordion、不做搜尋。
   - 竹北節目表圖片需可點擊放大，並預留少量文字說明空間。
   - 竹北場節目表說明文字第一版顯示「節目表說明待補」。
   - **節目資料編輯流程（2026-05-10）**：
     - 由 `scripts/programs-to-csv.mjs` 將 JSON 攤平成 6 欄 CSV（場次 / 老師 / 時段 / 序號 / 演出者 / 曲目）給曲目表負責人在 Google Sheets 編輯。
     - 「老師」欄（`teacherDisplayName`）為定位 key，13 位皆唯一；items[] 順序 = CSV 列順序。
     - 回灌時由 AI 依 script 檔頭 docstring 的契約 + checklist（老師連續性、序號保留前導零等）merge 回 JSON。
     - 中介 `exports/` 不進 git，每次需要時重新匯出。
   - **items[] schema 簡化（2026-05-10）**：
     - 移除 `performers[]` 和 `type` 欄位；items 只保留 `order / performer / title`。
     - 個別學生姓名以 substring 搜尋方式命中 `performer` 顯示字串（搜尋邏輯不變，但靠約定使顯示字串內含全部姓名）。
     - 團班顯示約定：`performer` 開頭以半形 `(團名)` + 空白 + 名單（用「、」分隔），例 `(鍵盤團班) 何禹昕、高荺晴、施柏安、劉采恩、王若宏`。
     - 前端 `ProgramAccordion` 對符合該 pattern 的字串解析為「團名標籤 + 編號學生名單」雙段渲染；不符合時 fallback 成單行字串。
     - Mr. Vincent 老師名統一為「林老師」（原為「***老師」），其他老師沿用單姓格式。

10. **Nav**
    - 斗南場導覽列：場地資訊、時間表、節目表、我迷路了、聯絡我們。
    - 竹北場導覽列：場地資訊、時間表、節目表、聯絡我們。

11. **Contacts**
    - 使用 `data/contacts.json`。
    - LINE 官方帳號連結為 `https://line.me/R/ti/p/@ykh1020h`，顯示名稱可用 `@ykh1020h`。
    - Facebook 粉絲專頁連結為 `https://www.facebook.com/museeksoul/?locale=zh_TW`。
    - 電話為 `05 596 6996`，前端可使用 `tel:055966996`。
    - LINE ID 目前待定。
    - 未補連結時仍顯示該項目與「待補」文字，不隱藏。
    - **多據點聯絡版型（2026-05-10）**：
      - `contacts.items[]` 新增 `platformLabel` 與 `contextLabel`，前台主要顯示平台名稱（LINE / Facebook / Instagram / 電話），完整官方名稱仍保留於 `value` 與無障礙標籤。
      - `contacts.items[]` 新增 `audience`，用來標示 `all` / `dounan` / `zhubei`，避免多據點粉專只顯示平台名時失去分流意義。
      - 使用者已選定 `03 Directory List`；`ContactSection` 正式改為依 `contacts.directoryGroups` 顯示「活動主要聯絡 / 斗南教室 / 竹北教室 / 官方社群」。
      - `contacts.stylePreview.enabled` 已關閉，候選版型與 preview UI 已移除。
      - 決策原因：參考多個設計成熟網站與 footer/social link best practices，多平台入口通常以平台名或 icon 為主，避免將完整粉專名稱重複攤開造成視覺噪音。
      - 進一步修正：多據點品牌的聯絡入口需優先呈現據點或任務脈絡（斗南教室 / 竹北教室 / 官方共用），平台名稱退為卡片內的動作入口，符合 location page 與 information scent 原則。

12. **Visual Direction**
    - 最新主視覺方向改為「優雅草地音樂會邀請函」。
    - 新方向以白底留白、朱紅主色、細線植物、鋼琴線稿、古典襯線標題、活動手冊 / 節目冊感為核心。
    - `hueixin-music-club-poster.pdf` 不再作為主要視覺來源，只保留品牌名稱與音樂元素參考。
    - `visual-direction-mobile.png` / `visual-direction-wide.png` 不再作為主要視覺方向，避免回到高彩度青春復古社團感。
    - 首頁需要保留品牌名稱與活動名稱，不只顯示場次分流；但第一屏主要動作仍是選擇「斗南場 / 竹北場」。
    - 詳細規範見 `visual-style-guide.md`。

13. **Data Flow**
    - 新增 `data/events.json` 作為首頁與頁面外框的活動基本資料來源。
    - `data/events.json` 只索引品牌、活動名稱、場次 route、eventId 與各資料檔位置，不取代場地、時間表、節目或聯絡資料檔。
    - `engineering-plan.md` 已補上前端元件與資料來源對照表。

14. **Generated Music Component Assets**
    - 已新增 `public/assets/music-components/`，內含爵士鼓、鋼琴、吉他各 3 個去背 PNG 元件。
    - 這批元件是使用者要求的復古高彩度海報風格探索資產，目前未接入前端頁面。
    - 原因 / 風險：現行網站主視覺仍以 `visual-style-guide.md` 的「優雅草地音樂會邀請函」為準；若未來要套用這批元件，需由使用者明確確認整體風格切換，避免違反「不要做回高彩度復古感」的既有規則。

## Do Not Override

- 不要把「時間表圖片」拿來替代「場地資訊」。
- 不要把竹北場硬套斗南場戶外園區導覽結構。
- 不要讓竹北場出現「我迷路了」區塊或 tab。
- 不要從圖片或常識猜竹北商辦地址、座標、樓層、換證流程。
- 不要以「遲到 / 晚到 / 超過時間」描述竹北場自行換證入場。
- 不要同時顯示竹北場「工作人員接待」與「自行換證入場」的完整流程。
- 若竹北場無對應截圖，請勿擅自創造不存在的圖片或顯示缺圖 placeholder。
- 竹北場地資訊 UX 詳細規格以 `ZHUBEI_VENUE_UX_HANDOFF.md` 為準。
- 不要將工作人員 / 老師內部流程顯示在網站。
- 不要將老師版時間表圖片放入公開網站 schedule gallery。
- 不要為時間表 lightbox 加左右切換或下載按鈕。
- 不要為竹北節目表建立 `programs` JSON 或搜尋欄。
- 不要讓斗南節目搜尋即時過濾；只在搜尋欄 blur 後執行。
- 不要在斗南搜尋結果狀態保留完整 accordion；只顯示符合項目。
- 不要直接引用中文舊路徑或 `source-materials/...` 作為正式前端資產路徑。
- 不要把全站視覺做回高彩度、彩虹、復古社團海報感。
- 不要以 `hueixin-music-club-poster.pdf` 作為主要版面或色彩來源。
- 不要讓首頁只剩工具式場次分流而完全沒有活動名稱與品牌儀式感。
- 不要在首頁或頁面外框 hardcode 第二份品牌、活動名稱、場次 route；請從 `data/events.json` 讀取或衍生。
- 不要把 `performers[]` / `type` 加回 `programs.dounan.json` 的 items[] schema（已於 2026-05-10 簡化為 `order / performer / title`）。
- 不要為節目編輯流程在 `data/programs.dounan.json` 上手動 patch；請走 `scripts/programs-to-csv.mjs` 匯出 CSV → Google Sheets 編輯 → AI 回灌的循環。
- 不要把團班 / 多人合奏顯示拆成另一份資料結構；前端應從 `performer` 字串的 `(團名) 名1、名2` 約定解析。

## Next Open Questions

1. **竹北場地資訊**（已實作 2026-05-06，待視覺驗收）
   - ✅ 已依 `ZHUBEI_VENUE_UX_HANDOFF.md` 重構 `data/venue.zhubei.json` 與重寫 `ZhubeiVenueSection`。
   - ✅ 已將 8 張使用中圖片複製到 `public/assets/zhubei/venue/`（`zhubei-venue-01.jpg` 與示意圖未複製）。
   - 待使用者實機驗收（375px 手機 / 桌機）視覺與互動。

2. **實作驗收**
   - 375px 手機不破版。
   - sticky nav 不遮擋內容。
   - 圖片 lightbox 可開關且不裁切重要內容。
   - `/dounan`、`/zhubei` 重新整理不 404。
   - `npm run build` 成功。

3. **部署**
   - GitHub remote / branch 策略。
   - Cloudflare Pages 設定。
   - 正式 domain。
   - 是否 main branch 自動部署。

## Next Suggested Action

1. 依 `ZHUBEI_VENUE_UX_HANDOFF.md` 實作竹北場場地資訊 UX。

## Verification Notes

- `data/schedules.public.json` 已驗證為合法 JSON。
- `data/schedules.public.json` 中公開參加者版與 excluded 老師版時間表圖片路徑已於本輪改名後重新驗證存在。
- 已新增 `data/venue.zhubei.json`，並已驗證為合法 JSON。
- 已新增 `data/contacts.json`，並已驗證為合法 JSON。
- 已新增 `visual-style-guide.md`，並已更新 `gemini-visual-prompt.md` 與 `event-website-spec.md` 改採新視覺方向。
- 已新增 `data/events.json`，並已在 `engineering-plan.md` 補上資料來源與前端元件對照。
- 已驗證 `data/events.json`、場地資料、時間表資料、節目資料、聯絡資料皆為合法 JSON。
- 已驗證 `data/events.json` 的 `eventId` 可對上 `data/venue.*.json` 與 `data/schedules.public.json`。
- 已驗證資料檔中目前引用的 `source-materials/...` 圖片路徑都存在；正式前端實作時仍需複製到 `public/assets` 後引用公開路徑。
- 2026-05-10：已將復古海報風格樂器生成圖拆成 9 個獨立去背 PNG，輸出於 `public/assets/music-components/`；已用 checkerboard 預覽確認四角透明。
- 2026-05-10：聯絡區塊多據點 Directory List 正式版已通過 `data/contacts.json` JSON parse、`node ./node_modules/vitest/vitest.mjs run`（24 tests passed）與 `node ./node_modules/vite/bin/vite.js build`。本機環境無 `npm` / `npx` 指令，改用 Codex bundled Node 執行本機依賴。
- 2026-05-10：節目編輯流程上線 + items[] schema 簡化：
  - 新增 `scripts/programs-to-csv.mjs`（含 CSV ↔ JSON 契約 docstring）。
  - `data/programs.dounan.json` 套用協作者第二輪 CSV 修訂（含曲目、姓名拼字、Mr. Vincent 老師名統一），移除所有 items 的 `performers[]` 與 `type`。
  - `ProgramAccordion.jsx` / `.module.css` 加入 `(團名) 名1、名2` 解析渲染（團名標籤 + 編號學生名單）；mobile（< 480px）header padding/gap/teacher font 微調讓老師名單行可塞下 `Miss. Khristin 黃老師`。
  - `npx vitest run` 24/24 通過。
- 已新增 `ZHUBEI_VENUE_UX_HANDOFF.md`，記錄竹北場場地資訊清楚表單式 UX、停車資訊、入場分流與圖片對應。
- 已驗證 `source-materials/zhubei/venue/竹北場地資訊示意圖.png` 與本次交接文件列出的竹北場 venue 圖片存在。
- 2026-05-06：依 `ZHUBEI_VENUE_UX_HANDOFF.md` 重構 `data/venue.zhubei.json`、重寫 `ZhubeiVenueSection.jsx` / `.module.css`、複製 8 張圖到 `public/assets/zhubei/venue/`；`npx vitest run` 24/24 通過、`npm run build` 成功（CSS 約 39.6KB / JS 約 287KB）；dist 內含 8 張圖與新文字內容。
- 2026-05-07：竹北 venue 第一輪視覺優化上線：
  - 場地資訊標題改置中 + ◇ 菱形分隔；摘要文字置中、暐順大樓與地址同行用 ｜ 分隔
  - Hero 由兩張並排改為單張 Le Phare 室內
  - 「選擇入場方式」標題改朱紅置中 + ◇ ─ 標題 ─ ◇ 裝飾
  - 停車卡 collapsed 加 summary 副標 + 紅色 car icon、chevron 改 22×22 SVG 加粗深色
  - 停車兩張圖下方加 captionLines 注意事項列表（◇ 朱紅菱形列點）
  - 自行換證入場新增首步驟「請至櫃檯辦理換證」（共 3 步）
  - 選中流程加 SelectedFlowBanner 米色外卡（雙層卡）
  - EventHero 副標移除（首頁仍顯示，由 HomePage 直接讀 events.json subtitle）+ EventHero padding-bottom 縮短讓 SectionNav 緊貼大標
- 最近一次 commit 後工作樹曾確認乾淨。
