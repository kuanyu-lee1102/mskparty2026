import { schedules, assetUrl } from '../data/siteData.js'
import ScheduleImageGallery from './ScheduleImageGallery.jsx'
import styles from './DounanScheduleSection.module.css'

/**
 * DounanScheduleSection
 *
 * 斗南場時間表區塊。資料來源唯一為 data/schedules.public.json#events.dounan。
 *
 * 規格依據：
 *  - event-website-spec.md「3. 時間表」
 *      只顯示參加者版圖片；老師版圖片不可顯示。
 *      手機版滿版、不裁切、可點擊放大、無 carousel、無下載按鈕。
 *      caption 貼齊原本圖片用途，不另外加正式文案。
 *  - engineering-plan.md 資料對照表：DounanScheduleSection 只讀 events.dounan 設定
 *  - project-progress.md Do Not Override：
 *      - 不可用時間表圖片取代場地資訊
 *      - 不可將老師版時間表放入公開網站
 *      - 不可加左右切換或下載按鈕
 *
 * 設計細節：
 *  - 使用 ScheduleImageGallery 已有 audience === 'participant' 雙重保險，
 *    這裡仍主動先過濾再傳入，符合工作規範第 7 點。
 *  - 不另開 module.css；僅做極輕量的 section wrapper / 標題樣式，集中在本檔內 CSS module。
 *    （工作規範允許「如必要可加，但說明理由」；理由：與其它 section 維持一致的
 *     section header / divider 視覺語言，不在 ScheduleImageGallery 共用元件內耦合。）
 *
 * Props:
 *  - id?: string         section id（建議由父層傳「schedule」）
 *  - title?: string      區塊標題，預設「時間表」
 *  - className?: string  外層額外 class
 */
export default function DounanScheduleSection({
  id,
  title = '時間表',
  className = '',
}) {
  const eventConfig = schedules?.events?.dounan
  const rawImages = Array.isArray(eventConfig?.images) ? eventConfig.images : []

  // 主動先過濾：只保留 audience === 'participant'，避免任何老師版意外洩漏
  const participantImages = rawImages
    .filter((img) => img.audience === 'participant')
    .map((img) => ({
      ...img,
      // 將 source-materials/... 轉為公開資產路徑
      path: assetUrl(img.path),
    }))

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className={styles.header}>
        <h2 id={id ? `${id}-title` : undefined} className={styles.title}>
          {title}
        </h2>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      <ScheduleImageGallery images={participantImages} />
    </section>
  )
}
