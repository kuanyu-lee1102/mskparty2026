import { schedules, assetUrl } from '../data/siteData.js'
import ScheduleImageGallery from './ScheduleImageGallery.jsx'

/**
 * ZhubeiScheduleSection
 *
 * 竹北場時間表 — 直接呈現公開參加者版圖片，使用 ScheduleImageGallery 包裝。
 *
 * 規格依據：
 *  - event-website-spec.md「3. 時間表」：
 *    「網站請直接呈現時間表圖檔，不要另外拆資料重做 timeline 或卡片。」
 *    「竹北場公開網站只顯示參加者版圖片」「老師版時間表只保留在素材資料夾，不顯示於公開網站」
 *  - engineering-plan.md 資料對照表：
 *    讀取 schedules.public.json#events.zhubei；
 *    使用共用 ScheduleImageGallery + ImageLightbox；
 *    不建立單一 generic ScheduleSection 硬塞兩場資料。
 *  - schedules.public.json renderingGuidance：
 *    primaryMode = 'image'，imageBehavior 規範交由 ScheduleImageGallery 實作。
 *  - project-progress.md Do Not Override：
 *    不可顯示老師版時間表 / 不可加 carousel 與下載按鈕 / 不可重做 timeline。
 *
 * 資料邊界：
 *  - 只讀 schedules.public.json 的 events.zhubei
 *  - 將 path（source-materials/...）轉成 assetUrl 公開路徑
 *  - 額外保險：在進入 gallery 前過濾 audience !== 'participant'
 *    （ScheduleImageGallery 內部也會再過濾一次）
 *
 * Props:
 *  - id?: string         section id（給 SectionNav 使用），預設 'schedule'
 *  - title?: string      區塊標題，預設「時間表」
 *  - className?: string  外層額外 class
 *
 * 註：此元件結構簡單，沒有自己的 module.css；版面內距與標題樣式
 *     沿用 inline styles + global tokens（與其他區塊維持一致），
 *     視覺細節由 ScheduleImageGallery 自身處理。
 */
export default function ZhubeiScheduleSection({
  id = 'schedule',
  title = '流程表',
  className = '',
}) {
  const eventConfig = schedules?.events?.zhubei ?? {}
  const rawImages = Array.isArray(eventConfig.images) ? eventConfig.images : []

  // 雙重保險：只讓參加者版進入 gallery（excludedImages 中的老師版另存於 JSON
  // 的 excludedImages 欄位，本來就不會出現在 images，但仍守住 audience filter）
  const galleryImages = rawImages
    .filter((img) => !img.audience || img.audience === 'participant')
    .map((img) => ({
      id: img.id,
      audience: img.audience,
      alt: img.alt,
      caption: img.caption,
      // 將 source-materials/... 轉為 public/assets/... 公開路徑
      path: assetUrl(img.path),
    }))

  // section 樣式：與 ContactSection / ZhubeiVenueSection 維持同一節奏
  const sectionStyle = {
    width: '100%',
    maxWidth: 'var(--max-content)',
    margin: '0 auto',
    padding: 'var(--space-xl) var(--space-md) var(--space-2xl)',
    scrollMarginTop: 'var(--space-3xl)',
  }

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-lg)',
  }

  const titleStyle = {
    margin: 0,
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: 'var(--color-text)',
    fontSize: 'clamp(1.375rem, 4vw, 1.75rem)',
    lineHeight: 1.2,
    letterSpacing: '0.04em',
  }

  const dividerStyle = {
    display: 'inline-block',
    width: '32px',
    height: '1px',
    backgroundColor: 'var(--color-vermilion)',
    opacity: 0.85,
  }

  return (
    <section
      id={id}
      className={className}
      style={sectionStyle}
      aria-labelledby={`${id}-title`}
    >
      <header style={headerStyle}>
        <h2 id={`${id}-title`} style={titleStyle}>
          {title}
        </h2>
        <span style={dividerStyle} aria-hidden="true" />
      </header>

      <ScheduleImageGallery images={galleryImages} />
    </section>
  )
}
