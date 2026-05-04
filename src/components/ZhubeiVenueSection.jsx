import { venueZhubei, assetUrl } from '../data/siteData.js'
import MapButton from './MapButton.jsx'
import PlaceholderBox from './PlaceholderBox.jsx'
import styles from './ZhubeiVenueSection.module.css'

/**
 * ZhubeiVenueSection
 *
 * 竹北場場地資訊 — 商辦內部「步驟式」抵達流程。
 *
 * 規格依據：
 *  - event-website-spec.md「2. 場地資訊 → 竹北場場地資訊」：
 *    「以步驟式文字配圖為主，每一步可有一張圖片或 placeholder。
 *      圖片未補齊時顯示「圖片待補」。地址、座標、樓層、換證細節未確認時顯示「待補」。
 *      不要自行編造商辦地址、座標、樓層或換證規則。」
 *  - engineering-plan.md 資料對照表：使用 ZhubeiVenueSection + ArrivalStepList，
 *    Apple Maps 不需要。
 *  - visual-style-guide.md §九 卡片 / §十「竹北場：商辦內動線用步驟卡呈現」/
 *    §六 色彩 / §七 字體
 *  - project-progress.md Confirmed Decisions §7 Zhubei Venue / Do Not Override
 *    （不可從圖片或常識編造商辦地址、座標、樓層、換證流程）
 *
 * 資料邊界：
 *  - 只讀 venue.zhubei.json
 *  - Apple Maps 永遠不顯示（即使資料有 appleMaps 也不渲染）
 *  - arrivalSteps 直接照 JSON 順序渲染；description === '待補' 時改用 PlaceholderBox
 *  - imageStatus !== 'ready' 或 image 為 null 時改用 PlaceholderBox 的「圖片待補」
 *
 * Props:
 *  - id?: string         section id（給 SectionNav 使用），預設 'venue'
 *  - title?: string      區塊標題，預設「場地資訊」
 *  - className?: string  外層額外 class
 */

const PENDING_TEXT = '待補'

function isPending(value) {
  return (
    typeof value !== 'string' ||
    value.length === 0 ||
    value === PENDING_TEXT
  )
}

export default function ZhubeiVenueSection({
  id = 'venue',
  title = '場地資訊',
  className = '',
}) {
  const data = venueZhubei ?? {}
  const summary = data.arrivalSummary ?? {}
  const steps = Array.isArray(data.arrivalSteps) ? data.arrivalSteps : []
  const googleMapsHref = data?.mapLinks?.googleMaps ?? ''

  // 顯示在 summary 卡片的：大樓名稱 / 地址（其餘換證、樓層欄位由步驟區呈現）
  const buildingName = summary.buildingName || data.venueName || ''
  const address = summary.address || data.displayAddress || ''

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={`${id}-title`}
    >
      <header className={styles.header}>
        <h2 id={`${id}-title`} className={styles.title}>
          {title}
        </h2>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      {/* ===== 抵達摘要卡：大樓名稱 + 地址 + Google Maps 按鈕 =====
          只顯示已確認資料；不可顯示 Apple Maps（規格明定不需要）。 */}
      <div className={styles.summaryCard}>
        {buildingName ? (
          <p className={styles.buildingName}>{buildingName}</p>
        ) : null}
        {address ? (
          <p className={styles.address}>{address}</p>
        ) : (
          <PlaceholderBox label={PENDING_TEXT}>
            商辦地址待補
          </PlaceholderBox>
        )}

        {googleMapsHref ? (
          <div className={styles.mapButtons}>
            <MapButton
              provider="google"
              href={googleMapsHref}
              variant="primary"
            >
              用 Google 地圖開啟
            </MapButton>
          </div>
        ) : (
          <PlaceholderBox label="Google Maps 連結待補" tone="info" />
        )}
      </div>

      {/* ===== 步驟式抵達流程 ===== */}
      {steps.length > 0 ? (
        <ol className={styles.stepList}>
          {steps.map((step, index) => (
            <li key={step.id ?? index} className={styles.stepItem}>
              <ArrivalStepCard step={step} index={index} />
            </li>
          ))}
        </ol>
      ) : (
        <PlaceholderBox label={PENDING_TEXT}>
          抵達流程步驟待補
        </PlaceholderBox>
      )}
    </section>
  )
}

/**
 * 單一步驟卡片：序號 + 標題 + 描述（或「待補」placeholder）+ 圖片（或「圖片待補」placeholder）
 *
 * 資料行為：
 *  - description 為 '待補' / 空值 → 用 PlaceholderBox
 *  - image 為 null 或 imageStatus !== 'ready' → 用 PlaceholderBox（label 取 step.placeholderLabel || '圖片待補'）
 */
function ArrivalStepCard({ step, index }) {
  const number = String(index + 1).padStart(2, '0')
  const title = step?.title ?? ''
  const description = step?.description ?? ''
  const descriptionIsPending = isPending(description)

  const imageReady =
    step?.imageStatus === 'ready' &&
    typeof step?.image === 'string' &&
    step.image.length > 0

  const placeholderLabel =
    typeof step?.placeholderLabel === 'string' && step.placeholderLabel.length > 0
      ? step.placeholderLabel
      : '圖片待補'

  return (
    <article className={styles.stepCard}>
      <header className={styles.stepHeader}>
        <span className={styles.stepNumber} aria-hidden="true">
          {number}
        </span>
        <h3 className={styles.stepTitle}>{title}</h3>
      </header>

      {/* 圖片區 */}
      <div className={styles.stepMedia}>
        {imageReady ? (
          <img
            src={assetUrl(step.image)}
            alt={step.imageAlt || title || '抵達流程圖片'}
            className={styles.stepImage}
            loading="lazy"
          />
        ) : (
          <PlaceholderBox label={placeholderLabel} />
        )}
      </div>

      {/* 描述區 */}
      <div className={styles.stepBody}>
        {descriptionIsPending ? (
          <PlaceholderBox label={PENDING_TEXT}>
            步驟說明待補
          </PlaceholderBox>
        ) : (
          <p className={styles.stepDescription}>{description}</p>
        )}
      </div>
    </article>
  )
}
