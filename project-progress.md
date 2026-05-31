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
- `data/market.json`：斗南場小市集擺攤店家資料
- `data/schedules.public.json`：斗南 / 竹北公開版時間表圖片設定
- `data/style-explorations.json`：風格重新對焦 preview 頁的八種方案文案與分組
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
   - 保留「我迷路了」功能。
   - 視覺整體對齊 Zhubei：
     - 區塊標題置中 + 朱紅菱形分隔（— ◇ —）。
     - 標題下方放 `heroImages`（眷村景觀圖；`source-materials/dounan/hero/dounan-jianguo-village-hero-white70-original.jpg`），220–280px cover。
     - 摘要置中：venueShortName 大字 +「venueName｜displayAddress」一行。
     - 「會場地點」改裝在米色（`bg-warm`）卡片內，header 為朱紅圓圈 pin icon + 標題 +「已棟蓄水池周邊蓄水池」摘要，卡內含縮小引導圖（max 480px / max-height 220–280px）與紅菱形 ◇ 列點：
       - 「紅圈處即為會場：已棟蓄水池周邊草地。」
       - 「可點擊下方引導按鈕。」
     - 引導圖採用紅圈標示版本：`source-materials/dounan/venue/dounan-venue-area-circled.jpg`。
   - 地圖按鈕僅保留 Google Maps（置中），按鈕文字「用 Google 地圖帶我去會場！」；已不再顯示 Apple Maps 按鈕（`mapLinks.appleMaps` 已從 JSON 移除）。
   - JSON 新增欄位：`venueShortName` / `meetingLocationLabel` / `meetingLocation` / `heroImages[]` / `guideImage.captionLines[]`。
   - **實作落地（2026-05-11）**：`DounanVenueSection.jsx` / `.module.css` 重寫，補上 `LocationPinIcon` 與 `DiamondDivider`；移除舊 `venueIntro` / `targetArea` / `targetDescription` / `primaryGoal` 樣式與引用。

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
   - **節目異動說明（2026-05-31）**：說明文字改由 `events.json#routes.events[id=zhubei].programNote` 提供；有值時 `ZhubeiProgramSection` 渲染正式說明（朱紅左條 `.note` 樣式），無值才 fallback 回「節目表說明待補」placeholder。目前內容為節目異動公告「12 傅郁芳、19 傅名宏 × Ms. Dayna 取消演出。」。仍不建立 programs JSON / accordion / 搜尋（符合 Do Not Override）。
   - **開場演出區塊（2026-05-31）**：節目表標題與圖片之間插入「開場演出」，資料由 `events.json#routes.events[id=zhubei].programOpenings`（`title` / `summary` / `items[].performer/piece/pieceLocal`）提供；視覺沿用竹北 venue「入場方式」的米色色塊（`--bg-warm`）＋ 朱紅圓形編號白卡語言（樣式自建於 `ZhubeiProgramSection.module.css`，未跨 CSS module 共用）。無 items 時整塊不渲染。仍不建 programs JSON / accordion / 搜尋。
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
     - Mr. Vincent 老師名統一為「林老師」（單姓格式，跟其他老師一致）。
   - **跨老師插入演出順序（2026-05-12）**：
     - 業主新版 CSV 允許某位老師學生插入另一位老師時段 / accordion 中，避免因少數調整而重做整個節目表 UI。
     - `items[]` 新增 optional `ownerTeacherDisplayName`；存在時代表該 item 顯示在目前 program 底下，但原指導老師不同。
     - 前端在節目卡片內顯示「{ownerTeacherDisplayName} 學生」小標籤；搜尋也會比對 `ownerTeacherDisplayName`，避免搜尋原指導老師時漏掉插入項目。
     - CSV 契約改為 `場次 / 顯示於老師 / 指導老師 / 時段 / 序號 / 演出者 / 曲目`；`顯示於老師` 定位 accordion，`指導老師` 只在跨老師插入時填寫。
     - 已依 `source-materials/dounan/programs/惠歆音樂社 2026音樂會 節目表 - programs.dounan-6.csv` 遷移：
       - `Miss. Wanda 許老師` 的 `藍亭筠 / 印地安人` 顯示於 `Miss. Linda 陳老師`。
       - `Mr. Kevin 張老師` 的 `李健誠、李宥宏 / Home Sweet Home` 顯示於 `Mr. Yang 李老師`。

10. **Nav**
    - 斗南場導覽列：場地資訊、時間表、節目表、小市集、聯絡我們。
    - 竹北場導覽列：場地資訊、時間表、節目表、聯絡我們。
    - 小市集只屬於斗南場，竹北場不顯示。

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

15. **Dounan Jianguo Hero Asset**
    - 已新增 `public/assets/dounan/hero/dounan-jianguo-village-hero-white70-original.jpg`。
    - 以使用者提供的建國眷村照片原亮度合成白色三行標題：「建國眷村 / JIANGUO MILITARY / DEPENDENTS' VILLAGE」。
    - 文字字形來源為使用者提供的竹北場首圖 PNG，不重新打字、不換字體；將字形填成全白後以 70% 透明度疊到照片上。
    - 使用者已決定不修照片中的春聯年份，維持原圖內容。
    - 原因 / 風險：目前只建立正式公開資產，尚未接入前端頁面；若要替換斗南場頁面頂部 hero，需再更新元件與資料來源，不要直接引用 `Downloads` 或其他本機路徑。

16. **Dounan Market（小市集，2026-05-12）**
    - 只在斗南場顯示，竹北場無小市集區塊。
    - 區塊位置：節目表之後、聯絡我們之前。
    - 資料來源：`data/market.json`，`vendors[]` 順序即為前端顯示順序。
    - 視覺為左 logo 方塊 + 右店名 + 聯絡圖示列，每家店之間以細線分隔。
    - 缺 logo 時顯示 placeholder「Logo 待補」，不可隱藏 logo 欄位。

17. **Style Exploration Preview（2026-05-13）**
   - 新增 `/style-exploration` 作為風格重新對焦比較頁，不改正式 `/`、`/dounan`、`/zhubei` 版面。
   - 前五案遵守使用者本輪限制：「背景維持現況，只小幅調整首頁與內頁最上方」；後三案解除限制，示範更完整的結構型轉向。
   - 文案與方案說明放在 `data/style-explorations.json`，避免在頁面元件中建立第二份顯示文案。
   - 方案可引用 `public/assets/music-components/` 的樂器 PNG，但目前只用於 preview；不得視為正式主視覺已切換。
   - 原因 / 風險：這是決策前的視覺探索，目的是讓使用者比較方向；若要採用其中一案，需再明確指定並回寫 `visual-style-guide.md`，再套到正式頁面。
   - **本輪修正**：使用者選定 01 方向，但指出參考海報的色塊邊界是弧線而非直線；`/style-exploration` 已改為只呈現 01-A / 01-B / 01-C 三個弧線版本，背景色塊改用橢圓/radial 層疊表現左上大弧與底部波浪。
   - **第二輪修正**：使用者選定 01-B 參考海報版；`/style-exploration` 已改為六個 01-B 延伸版本，前三個只少量增加音符 / 植物 / 星芒，後三個加入 `public/assets/music-components/` 的去背樂器元件比較。
   - **第三輪修正**：使用者確認植物不要、採用 01-B1 音符輕點版；`/style-exploration` 已改為只檢視內頁三案（A 留白導覽 / B 緞帶導覽 / C 資訊卡前導），不顯示植物或去背元件。
   - **第四輪修正**：使用者指出內頁 UI 參考歪得太嚴重，取消內頁元件調整；`/style-exploration` 改為只比較背景三案（柔弧邊框 / 網點角落 / 音符輕撒），元件維持原本 top/nav 示意，不再加資訊卡或改 nav 樣式。
   - **第五輪修正**：使用者選定背景 C，但指出左上方色塊分界邊緣模糊；已針對 `background-music-sprinkle` 把 radial-gradient 色塊過渡改為同色透明且縮短停止點，讓弧線邊界更乾淨。
   - **第六輪修正**：使用者要求先切 branch 再修背景 C 鋸齒；已切到 `codex-background-c-music-sprinkle`，並把 `background-music-sprinkle` 的色塊橢圓放大、邊界改為同色半透明短漸層，降低鋸齒感。
   - **第七輪修正**：使用者指出第六輪讓 C 色塊跑太遠、變太小；已將 C 的色塊尺寸與位置恢復為 B 的參數，改用 2x pseudo-layer 縮放 + 同色短漸層來提高邊緣平滑度。
   - **第八輪修正**：使用者要求接續製作內頁下半段，且延續「背景 C｜音符輕撒」呈現；曾誤做成謝幕 footer、再誤做成 UI 版型差異；已改為「同一套內頁 UI，只比較背景」三案（柔弧延伸 / 網點延伸 / 音符延伸），不套用正式頁。
    - `links[].type` 支援 facebook / instagram / line / note；type=note 用於 IG 私訊等無連結的訂購說明。
    - 第一家「國柱食作所」logo 已放在 `public/assets/dounan/market/guozhu-logo.jpg`；其他店家 logo 待補。

17. **Dounan Teacher Portrait Source Assets（師資陣容，2026-05-12）**
    - 使用者提供的斗南場師資圖存放於 `source-materials/dounan/teacher-portraits/`。
    - 已依圖片中的英文顯示名稱重新命名檔案，移除 `Mr.` / `Miss.` 前綴，避免與副檔名混淆。
    - 已依 `data/programs.dounan.json` 節目表老師順序加上兩位數序號。
    - 目前檔名為：`01-Candy.png`、`02-Vincent.png`、`03-Khristin.png`、`04-Wanda.png`、`05-Lucy.png`、`07-Vivian.png`、`08-Orange.png`、`09-Stone.png`、`10-Ben.png`、`11-Nick.png`、`12-Kevin.png`、`13-Yang.png`。
    - `06-Linda.png` 目前缺圖，先保留序號空位，避免後續接入前端時與節目表順序錯位。
    - 這批仍是 source material，若未來要接入前端，需先複製到 `public/assets/` 並透過資料檔引用，不可直接從 `source-materials/` 作為公開前端資產路徑。

18. **Formal Background Application（2026-05-14）**
    - 已將 `/style-exploration` 選定的背景 C 語言套用到正式首頁、斗南場、竹北場。
    - 首頁 `HomePage` 改為暖黃底 + 彩色弧形 + 網點紙感 + 少量音符 / 星芒；保留既有植物與品牌 logo 裝飾、資料仍全部來自 `data/events.json`。
    - 斗南 / 竹北頁新增共用 `EventPage.module.css`，只包住頁面背景與裝飾層，不改 `Venue` / `Schedule` / `Program` / `Contact` 等內容元件結構。
    - `EventHero` 背景改透明，讓頁面背景從頁首延續到導覽與內文；sticky nav 與各內容卡仍保留原本半透明暖白 / 白底可讀性。
    - 原因 / 風險：這是把已選定的背景探索落到正式頁，目標是統一首頁與內頁的活動紙本感；目前未更動任何文案、資料結構或前端資產來源。

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
- 不要把小市集區塊放到竹北場；小市集只屬於斗南場。
- 不要把店家 logo 直接從 `Downloads/` 或其他本機路徑引用；統一放 `public/assets/dounan/market/`，並透過 `data/market.json` 的 `logo` 欄位走 `assetUrl()`。
- 不要把 `/style-exploration` 當成正式網站頁面；它是本輪風格比較用 preview route，不應出現在正式導覽或 QR code。

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

1. 請使用者在 `http://localhost:5176/` 實際查看首頁、斗南場、竹北場背景套用後的視覺比例。
2. 若背景比例確認，下一步可整理 `/style-exploration` 是否保留為內部 preview route，或移除避免正式 QR code 誤用。

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
- 2026-05-11：已新增斗南建國眷村首圖 `public/assets/dounan/hero/dounan-jianguo-village-hero-white70-original.jpg`；維持原照片亮度與原春聯內容，沿用使用者提供的文字 PNG 字形，轉為全白 70% 透明度疊圖。已用本機影像預覽確認輸出存在。此輪未改前端程式，未跑 Vitest。
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
- 2026-05-11：斗南場場地資訊整體視覺對齊竹北場：
  - `data/venue.dounan.json` 新增 `venueShortName` / `meetingLocationLabel` / `meetingLocation` / `heroImages[]`，`guideImage.caption` 改為 `captionLines[]`，移除 `mapLinks.appleMaps`；`displayAddress` 更新為「632雲林縣虎尾鎮建國里建國一村55號」。
  - `DounanVenueSection.jsx` / `.module.css` 重寫：標題置中 + ◇ 菱形分隔；新增 hero（眷村景觀 cover 圖）；摘要置中大字 venueShortName + 「venueName｜displayAddress」；新增「會場地點」米色卡（朱紅 pin icon + 標題 + 摘要 + 縮小引導圖 + 紅菱形 captionList）；地圖按鈕改單顆「用 Google 地圖帶我去會場！」置中；移除 Apple Maps 按鈕。
  - 新增素材：
    - `public/assets/dounan/venue/dounan-venue-area-circled.jpg`（紅圈標示版引導圖，並鏡像至 `source-materials/dounan/venue/`）。
    - `public/assets/dounan/hero/dounan-jianguo-village-hero-white70-original.jpg` 也鏡像進 `source-materials/dounan/hero/`。
  - `npx vitest run` 24/24 通過、`npm run build` 成功（CSS 約 46.7KB / JS 約 296KB）。
- 2026-05-12：已依師資圖中文字辨識並重新命名 `source-materials/dounan/teacher-portraits/` 12 張 PNG：Ben / Candy / Kevin / Khristin / Lucy / Nick / Orange / Stone / Vincent / Vivian / Wanda / Yang。此輪只整理 source material，未改前端程式，未跑 Vitest。
- 2026-05-12：已依 `data/programs.dounan.json` 老師排序為師資圖檔名加上兩位數序號；因 `Miss. Linda` 圖片尚未提供，保留 `06-Linda.png` 空位，現有檔案為 01、02、03、04、05、07、08、09、10、11、12、13。此輪只整理 source material，未改前端程式，未跑 Vitest。
- 2026-05-12：已依 `programs.dounan-6.csv` 遷移跨老師插入演出順序，`data/programs.dounan.json` 新增兩筆 `ownerTeacherDisplayName`；`ProgramAccordion` 顯示原指導老師 badge，`programSearch` 納入該欄位搜尋，`scripts/programs-to-csv.mjs` 匯出欄位改為 `場次 / 顯示於老師 / 指導老師 / 時段 / 序號 / 演出者 / 曲目`。已產出 Google Sheets 用中介檔 `exports/programs.dounan.csv`（81 data rows + header）。`node ./node_modules/vitest/vitest.mjs run` 25/25 通過、`node ./node_modules/vite/bin/vite.js build` 成功。
- 2026-05-13：新增 `/style-exploration` 風格 preview route、`StyleExplorationPage.jsx` / `.module.css`、`data/style-explorations.json`，共 5 個維持現況小調方案 + 3 個解除限制結構方案。`npm run build` 成功、`npx vitest run` 25/25 通過；本機 Vite server 因 sandbox 需 escalated 啟動，已於 `http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：依使用者回饋把 `/style-exploration` 收斂為 01 海報邊框版的三個弧線版本（01-A 柔弧保守版、01-B 參考海報版、01-C 舞台波浪版），移除直線切割感；`npm run build` 成功、`npx vitest run` 25/25 通過，`http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：依使用者選定 01-B 參考海報版，`/style-exploration` 改為六版：01-B1 音符輕點、01-B2 植物角落、01-B3 平衡裝飾、01-B4 吉祥物角落、01-B5 吉他重點、01-B6 小樂團；已確認去背元件在 `public/assets/music-components/`。`npm run build` 成功、`npx vitest run` 25/25 通過，`http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：依使用者採用 01-B1 音符輕點版並移除植物需求，`/style-exploration` 改為內頁三案 preview，只呈現場次 hero / nav / 場地資訊起始卡；`npm run build` 成功、`npx vitest run` 25/25 通過，`http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：依使用者取消內頁元件調整，`/style-exploration` 改為只看背景三案；移除 preview 中新增的資訊卡，nav/hero 示意回到基本結構，只改背景弧線、網點與少量音符。`npm run build` 成功、`npx vitest run` 25/25 通過，`http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：依使用者選定背景 C 並要求修正左上弧線模糊，調整 `background-music-sprinkle` 的 radial-gradient stops，改用同色透明極短過渡；`npm run build` 成功、`npx vitest run` 25/25 通過，`http://127.0.0.1:5174/style-exploration` 回傳 HTTP 200。
- 2026-05-13：已建立並切換到 branch `codex-background-c-music-sprinkle`；再度調整背景 C 左上弧線鋸齒，將 radial-gradient 橢圓尺寸放大並使用同色半透明短漸層。`npm run build` 成功、`npx vitest run` 25/25 通過；dev server 重新啟動於 `http://127.0.0.1:5175/style-exploration`，HTTP 200。
- 2026-05-13：依使用者要求維持 B 的色塊大小，修正 `background-music-sprinkle`：元素本身只保留底色，色塊改由 2x pseudo-layer 繪製後縮回，gradient 尺寸/位置回到 B 的參數並用同色半透明短漸層平滑邊緣。`npm run build` 成功、`npx vitest run` 25/25 通過；`http://127.0.0.1:5175/style-exploration` HTTP 200。
- 2026-05-13：依使用者再次澄清「不要改 UI，只換背景」，`/style-exploration` 改為同一套內頁示意 UI，只比較背景 A 柔弧延伸、背景 B 網點延伸、背景 C 音符延伸；`npm run build` 成功、`npx vitest run` 25/25 通過（新 worktree 需 escalated 寫入 `node_modules/.vite-temp`），dev server 目前在 `http://127.0.0.1:5175/style-exploration` HTTP 200。
- 2026-05-14：正式套用背景 C 到首頁與斗南 / 竹北內頁；新增 `src/pages/EventPage.module.css`，更新 `HomePage` / `DounanPage` / `ZhubeiPage` / `EventHero`。`npx vitest run` 25/25 通過、`npm run build` 成功；dev server 目前在 `http://localhost:5176/`，已用 in-app browser 檢查首頁、斗南、竹北第一屏與斗南中段捲動，未見文字或 sticky nav 被背景裝飾遮擋。
- 2026-05-14：依 browser comment 修正正式內頁背景：`EventPage` 從 `overflow: hidden` 改為只限制橫向 overflow，解決無法捲到底；左上角粉紅弧形放大。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 確認 `/dounan` 可捲到「聯絡我們」底部。
- 2026-05-14：依使用者回饋將正式首頁 / 內頁背景底色由偏黃 `#fff2cf` 調白為 `#fff8ea`，保留背景 C 的弧形、網點、音符語言但降低整體黃感。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 檢查 `/` 與 `/dounan` 第一屏。
- 2026-05-14：依使用者回饋調淡內頁方形點點：`EventPage` 的點點 opacity 降低，遮罩改為水平中央閱讀欄淡出，讓中間內容區接近無點點、左右邊角保留紙感。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 檢查 `/dounan` 第一屏與中段。
- 2026-05-14：依使用者回饋調整內頁頁首裝飾：`EventPage` 保留少量不同色音符與一顆較厚、圓角的十字星，減少裝飾數量並避開返回首頁按鈕、場次標題、日期與 sticky nav。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 檢查 `/dounan` 第一屏。
- 2026-05-14：依設計平衡原則微調內頁頁首裝飾位置：左上紅色塊視為主要視覺重量，右上厚十字星與右側綠音符作不對稱平衡，左下粉音符接回紅色塊與日期區，避免平均散點造成平板。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 檢查 `/dounan` 第一屏。
- 2026-05-14：依使用者要求新增第二顆十字星：新增小型低透明度黃色星於左側中上空白處，色彩比右上黃星更淡，避免紫色造成畫面往左偏；尺寸與透明度低於右上黃星，避免搶主視覺重量。`npx vitest run` 25/25 通過、`npm run build` 成功；已用 in-app browser 檢查 `/dounan` 第一屏。
- 最近一次 commit 後工作樹曾確認乾淨。
