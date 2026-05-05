# CLAUDE.md

任何 AI（Claude Code 或其他）在這個 repo 動工前**必讀**這份。

## 必讀文件（按順序）

1. `project-progress.md` — 決策紀錄 + **Do Not Override** 規則列表
2. `SESSION_HANDOFF.md` — 目前進度與待補項目
3. `event-website-spec.md` — 產品規格
4. `engineering-plan.md` — 資料 / 元件邊界
5. `visual-style-guide.md` — 視覺準則

`project-progress.md` 是「為什麼這樣決定」的唯一真實來源。任何非瑣碎改動完成後請更新它。

## 安全規則：這是 public repo

這個 repo 部署在 GitHub Pages 免費方案，因此 **必須是 public**，所有 commit 公開可見。

**絕對不可 commit 任何 secret：**
- API keys / tokens / 密碼 / 私鑰 / 內部 endpoint URL
- 任何不希望公開的值

純靜態網站幾乎不需要 secret。若功能需要，先和使用者討論再實作，**不要自行建立 `.env` 並 commit**。

若不慎 commit 進 secret：
1. **視為已外洩，立刻 rotate（產生新值並讓舊值失效）**
2. 後續 commit 刪檔**不足以解決** — 值仍在 git history
3. 動 history 改寫前先告知使用者

## 開發規則摘要

- 不 hardcode 顯示文案 — 一律從 `data/*.json` 讀
- 缺資料用 `<PlaceholderBox>`，不要編造
- commit 前跑 `npx vitest run`
- 老師版時間表 / 內部流程不可出現在公開網站（詳見 `project-progress.md` Do Not Override）
- 不直接從 `source-materials/` 引用為前端資產 — 透過 `assetUrl()` 走 `public/assets/`
- Push 到 `main` 會自動經 `.github/workflows/deploy.yml` 部署到 https://kuanyu-lee1102.github.io/mskparty2026/

## 常用指令

```
npm run dev          # 開發伺服器（http://localhost:5173/）
npm run build        # 產出 dist/，base 自動套 /mskparty2026/
npm run preview      # 預覽 build 結果（http://localhost:4173/）
npx vitest run       # 跑單元測試
```
