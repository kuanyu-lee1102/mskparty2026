# 竹北場地資訊 UX 交接文件

更新日期：2026-05-06

本文件是竹北場場地資訊區塊的詳細 UX 與內容交接。`project-progress.md` 只保留高層決策與本文件引用；實作細節、圖片對應、流程原則以本文件為準。

## 一、設計目標

竹北場位於商辦大樓內，使用者主要需求不是閱讀完整交通文章，而是在手機上快速確認：

- 我是不是到了正確的大樓。
- 開車時停車入口在哪裡。
- 我進大樓後該走「工作人員接待」還是「自行換證入場」。
- 我只需要看到自己當下需要的流程。

因此竹北場地資訊採「清楚表單式」UX，而不是把所有圖片與說明一次攤開。

參考樣式：

- `source-materials/zhubei/venue/竹北場地資訊示意圖.png`

參考方向以這張示意圖的資訊層級為主：地點摘要、Google Maps、停車資訊、入場方式選擇、所選流程步驟。視覺細節仍需遵守 `visual-style-guide.md` 的白底、朱紅、細線、活動手冊感。

## 二、頁面資訊架構

竹北場場地資訊建議順序：

1. **場地摘要**
   - `Le Phare 共享空間竹北館`
   - `暐順經貿大樓`
   - `新竹縣竹北市復興三路二段168號 9號樓之5室`
   - Google Maps 主要按鈕：`用 Google 地圖開啟`

2. **開車與停車資訊**
   - 放在 Google Maps 按鈕下方。
   - 預設收合，使用者需要時再展開。
   - 展開後顯示停車入口與地下停車場電梯入口圖片。

3. **選擇入場方式**
   - 使用兩個清楚的選項：
     - `工作人員接待`
     - `自行換證入場`
   - 預設顯示 `工作人員接待`。
   - 使用者選擇其中一種後，只顯示該流程，不顯示另一條完整流程。

4. **所選流程步驟**
   - 每個步驟可包含標題、簡短說明、對應圖片。
   - 沒有對應截圖的步驟不要顯示圖片 placeholder，也不要擅自創造不存在的圖片。

## 三、UX 原則

- **只顯示必要流程**：選擇 `工作人員接待` 時，不顯示自行換證完整流程；選擇 `自行換證入場` 時，不顯示工作人員接待完整流程。
- **避免負面時間語氣**：不要使用「遲到」、「晚到」、「超過時間」等字眼。
- **中性描述入場分流**：`自行換證入場` 是備用流程，不要讓使用者感覺被標記為遲到。
- **停車資訊獨立於入場方式**：停車可能發生在任何入場方式前，因此放在 Google Maps 下方、入場分流上方。
- **圖片輔助辨識，不做素材堆疊**：每張圖片要支援一個具體現場任務，例如確認大樓、找到大廳、找到會合點、找到停車入口。
- **不要編造缺漏內容**：若無對應截圖或已確認資料，請勿自行補圖、補樓層細節、補櫃台位置或補不存在的動線。

## 四、圖片素材對應

所有圖片目前位於：

- `source-materials/zhubei/venue/`

正式前端實作時，需將實際使用的圖片複製到 `public/assets/zhubei/venue/` 或等效公開資產資料夾，再透過 `assetUrl()` 或公開資產路徑引用。不要讓前端直接引用 `source-materials/...`。

### 場地摘要

| 用途 | 檔名 | 備註 |
| --- | --- | --- |
| Le Phare 空間代表圖 | `zhubei-le-phare-interior.jpg` | 可用於摘要卡或場地氛圍圖 |
| 大樓外觀 / 暐順經貿大樓 | `zhubei-building-exterior.png` | 協助確認抵達正確建築 |

### 停車資訊

| 用途 | 檔名 | 備註 |
| --- | --- | --- |
| 高鐵二路停車場入口 | `zhubei-parking-entrance-close.jpg` | 停車資訊展開後顯示 |
| 地下停車場電梯入口 | `zhubei-parking-entrance-close2.png` | 停車資訊展開後顯示 |

### 工作人員接待

| 用途 | 檔名 | 備註 |
| --- | --- | --- |
| 一樓大廳入口 | `zhubei-lobby-entrance.png` | 協助使用者進入後辨識大廳 |
| 接待會合點 | `zhubei-reception-meeting-point.jpg` | 用於「工作人員接待」流程 |

### 自行換證入場

| 用途 | 檔名 | 備註 |
| --- | --- | --- |
| 一樓大廳往商辦電梯方向 | `zhubei-elevator-direction-from-lobby.png` | 用於完成大樓入館流程後往電梯 |
| Le Phare 入口 / 9 樓會場入口 | `zhubei-le-phare-entrance.png` | 用於抵達 9 樓後找會場 |

### 備用 / 不作為主要 UX

| 用途 | 檔名 | 備註 |
| --- | --- | --- |
| 舊整合導引圖 | `zhubei-venue-01.jpg` | 可保留作人工參考，不建議放進主要 UX |

## 五、目前不放的內容

- `一樓換證櫃台 / 警衛櫃台 / 換證位置`：目前沒有對應截圖，不放。
- `電梯樓層按鈕 / 9 樓`：與既有流程重疊高，不放。
- `9 樓出電梯後第一眼看到的畫面`：不另放，改由 `zhubei-le-phare-entrance.png` 表示會場入口。
- 沒有圖片的內容不要以「圖片待補」佔位，避免讓公開網站看起來未完成。

## 六、建議資料結構

`data/venue.zhubei.json` 建議由舊的線性 `arrivalSteps` 改為分組資料，讓 UI 可以清楚對應「停車資訊」與「入場方式」：

```json
{
  "heroImages": [
    {
      "src": "source-materials/zhubei/venue/zhubei-le-phare-interior.jpg",
      "alt": "Le Phare 共享空間竹北館室內空間"
    },
    {
      "src": "source-materials/zhubei/venue/zhubei-building-exterior.png",
      "alt": "暐順經貿大樓外觀"
    }
  ],
  "parkingInfo": {
    "title": "開車與停車資訊",
    "summary": "停車入口位於高鐵二路，停車後可依地下停車場電梯入口前往一樓大廳。",
    "defaultExpanded": false,
    "images": [
      {
        "src": "source-materials/zhubei/venue/zhubei-parking-entrance-close.jpg",
        "alt": "高鐵二路停車場入口"
      },
      {
        "src": "source-materials/zhubei/venue/zhubei-parking-entrance-close2.png",
        "alt": "地下停車場電梯入口"
      }
    ]
  },
  "entryFlows": {
    "defaultFlowId": "staffReception",
    "items": [
      {
        "id": "staffReception",
        "title": "工作人員接待",
        "summary": "一樓大廳會合，由工作人員協助帶位。",
        "steps": [
          {
            "title": "抵達一樓大廳",
            "description": "進入大樓後，請至一樓大廳尋找活動接待人員。",
            "image": "source-materials/zhubei/venue/zhubei-lobby-entrance.png",
            "imageAlt": "暐順經貿大樓一樓大廳入口"
          },
          {
            "title": "與接待人員會合",
            "description": "工作人員會協助確認並帶位前往 9 樓會場。",
            "image": "source-materials/zhubei/venue/zhubei-reception-meeting-point.jpg",
            "imageAlt": "一樓大廳接待會合位置"
          }
        ]
      },
      {
        "id": "selfCheckIn",
        "title": "自行換證入場",
        "summary": "若現場未遇到接待人員，可依大樓流程換證入場。",
        "steps": [
          {
            "title": "依大樓流程換證",
            "description": "完成入館流程後，請往商辦電梯方向前進。",
            "image": "source-materials/zhubei/venue/zhubei-elevator-direction-from-lobby.png",
            "imageAlt": "一樓大廳往商辦電梯方向"
          },
          {
            "title": "前往 9 樓會場",
            "description": "抵達 9 樓後，依 Le Phare 招牌前往會場入口。",
            "image": "source-materials/zhubei/venue/zhubei-le-phare-entrance.png",
            "imageAlt": "Le Phare 共享空間竹北館入口"
          }
        ]
      }
    ]
  }
}
```

這段 JSON 是實作參考，不代表必須完全照抄欄位名；但最終資料應保留同樣的資訊分組能力。

## 七、實作驗收重點

- `/zhubei` 場地資訊第一屏能快速看到地點、地址與 Google Maps。
- Google Maps 下方是 `開車與停車資訊`，預設收合。
- `選擇入場方式` 預設選中 `工作人員接待`。
- 切換至 `自行換證入場` 後，不顯示工作人員接待完整流程。
- 不出現「遲到」、「晚到」、「超過時間」等字眼。
- 沒有對應截圖的項目不顯示圖片 placeholder。
- 使用圖片必須都能對應到 `source-materials/zhubei/venue/` 中已存在的檔案。
- 正式前端資產需放在 `public/assets/zhubei/venue/`，不可直接引用 `source-materials/...`。
