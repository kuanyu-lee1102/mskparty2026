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
- `data/venue.dounan.json`：斗南場場地資訊
- `data/venue.zhubei.json`：竹北場場地資訊
- `data/contacts.json`：聯絡資訊
- `data/programs.dounan.json`：斗南場節目表資料
- `data/schedules.public.json`：斗南 / 竹北公開版時間表圖片設定
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
   - 商辦 / 商場正式名稱為「暐順經貿大樓」。
   - 正式地址為「新竹縣竹北市復興三路二段168號 9號樓之5室」。
   - Google Maps 連結為 `https://maps.app.goo.gl/n4jS88sTgs6sUhNe7`。
   - 竹北場不需要 Apple Maps 連結。
   - 包含 Google Maps 圖或座標、商場地址、換證流程、電梯樓層、出電梯後找會場。
   - 不顯示「我迷路了」。
   - 換證流程、入口或電梯、樓層、出電梯後指引與對應圖片會後續提供圖文說明。
   - 缺資料時顯示「待補」，不可自行編造樓層、換證規則或動線細節。

8. **Schedule**
   - 使用 `DounanScheduleSection` / `ZhubeiScheduleSection`。
   - 資料來源為 `data/schedules.public.json`。
   - 直接呈現對外版時間表圖片，不另外拆資料重做 timeline 或卡片。
   - 圖片需可點擊放大，使用 lightbox / modal，並提供明顯關閉按鈕。
   - 工作人員與老師內部流程不放網站，另外在工作 LINE 群發布。

9. **Programs**
   - 斗南場使用 `data/programs.dounan.json`。
   - 斗南場節目表需支援 accordion 與搜尋。
   - 搜尋範圍包含老師、學生、曲目，搜尋在 input blur 後執行。
   - 竹北場節目表只呈現圖片 `source-materials/zhubei/programs/zhubei-program-sheet-01.png`。
   - 竹北場節目表不做 JSON、不做 accordion、不做搜尋。
   - 竹北節目表圖片需可點擊放大，並預留少量文字說明空間。

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

## Do Not Override

- 不要把「時間表圖片」拿來替代「場地資訊」。
- 不要把竹北場硬套斗南場戶外園區導覽結構。
- 不要讓竹北場出現「我迷路了」區塊或 tab。
- 不要從圖片或常識猜竹北商辦地址、座標、樓層、換證流程。
- 不要將工作人員 / 老師內部流程顯示在網站。
- 不要為竹北節目表建立 `programs` JSON 或搜尋欄。
- 不要直接引用中文舊路徑或 `source-materials/...` 作為正式前端資產路徑。

## Next Open Questions

1. **竹北場地資訊**
   - 換證流程細節是什麼？
   - 搭哪一部電梯或哪個入口？
   - 電梯樓層與出電梯後指引是什麼？
   - 對應圖文說明與圖片素材。

2. **首頁與視覺方向**
   - 要以哪一張 `visual-direction-*.png` 作主要視覺參考？
   - 是否要更明確引用 `hueixin-music-club-poster.pdf` 的品牌元素？

3. **圖片呈現細節**
   - 斗南時間表兩張圖是否都顯示？
   - 竹北時間表兩張圖是否都顯示？
   - 圖片 caption 是否需改成正式文案？

4. **資料檔補齊**
   - 是否新增 `data/events.json`？

5. **實作驗收**
   - 375px 手機不破版。
   - sticky nav 不遮擋內容。
   - 圖片 lightbox 可開關且不裁切重要內容。
   - `/dounan`、`/zhubei` 重新整理不 404。
   - `npm run build` 成功。

6. **部署**
   - GitHub remote / branch 策略。
   - Cloudflare Pages 設定。
   - 正式 domain。
   - 是否 main branch 自動部署。

## Next Suggested Action

1. 決定首頁與整體視覺方向。
2. 決定時間表圖片呈現細節。
3. 決定是否新增 `data/events.json`。
4. 整理最終 Claude implementation prompt，或直接開始 Vite + React 實作。

## Verification Notes

- `data/schedules.public.json` 已驗證為合法 JSON。
- `data/schedules.public.json` 中四張時間表圖片路徑已驗證存在。
- 已新增 `data/venue.zhubei.json`，並已驗證為合法 JSON。
- 已新增 `data/contacts.json`，並已驗證為合法 JSON。
- 最近一次 commit 後工作樹曾確認乾淨。
- 本文件建立後尚未 commit。
