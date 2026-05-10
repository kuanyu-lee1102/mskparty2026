import { useState, useCallback } from 'react'

import { venueDounan, assetUrl } from '../data/siteData.js'
import MapButton from './MapButton.jsx'
import ImageLightbox from './ImageLightbox.jsx'
import styles from './DounanVenueSection.module.css'

/**
 * DounanVenueSection
 *
 * 斗南場場地資訊區塊。資料來源唯一為 data/venue.dounan.json。
 *
 * 視覺對齊：
 *  - 標題列採用與 ZhubeiVenueSection 相同的菱形分隔線樣式（— ◇ —）
 *  - 摘要置中：venueShortName（大字）+ venueName ｜ displayAddress + 會場地點 ｜ meetingLocation
 *  - 主要 CTA：單顆 Google Maps 按鈕（已不再提供 Apple Maps）
 */
export default function DounanVenueSection({
  id,
  title = '場地資訊',
  className = '',
}) {
  const [activeImage, setActiveImage] = useState(null)
  const handleClose = useCallback(() => setActiveImage(null), [])
  const openImage = useCallback((img) => setActiveImage(img), [])

  const {
    venueShortName,
    venueName,
    displayAddress,
    meetingLocationLabel,
    meetingLocation,
    mapLinks,
    heroImages,
    guideImage,
    supportingImages,
  } = venueDounan ?? {}

  const heroList = Array.isArray(heroImages) ? heroImages : []

  const guideImageUrl =
    guideImage && guideImage.status === 'ready' && guideImage.path
      ? assetUrl(guideImage.path)
      : ''

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
        <DiamondDivider />
      </header>

      {/* ===== Hero 圖（置於分隔線與場地名稱之間，對齊 Zhubei） ===== */}
      {heroList.length > 0 ? (
        <div className={styles.heroSingle}>
          {heroList.map((img) => (
            <button
              key={img.src}
              type="button"
              className={styles.heroImageButton}
              onClick={() =>
                openImage({
                  path: assetUrl(img.src),
                  alt: img.alt,
                  caption: img.caption,
                })
              }
              aria-label={`放大檢視：${img.alt}`}
            >
              <img
                src={assetUrl(img.src)}
                alt={img.alt}
                className={styles.heroImage}
                loading="lazy"
              />
              <span className={styles.zoomHint} aria-hidden="true">
                點擊放大
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* ===== 場地名稱與地址（置中） ===== */}
      <div className={styles.summaryText}>
        {venueShortName ? (
          <p className={styles.venueShortName}>{venueShortName}</p>
        ) : null}
        {venueName || displayAddress ? (
          <p className={styles.venueLine}>
            {venueName ? (
              <span className={styles.venueName}>{venueName}</span>
            ) : null}
            {venueName && displayAddress ? (
              <span className={styles.venueLineSeparator} aria-hidden="true">｜</span>
            ) : null}
            {displayAddress ? (
              <span className={styles.address}>{displayAddress}</span>
            ) : null}
          </p>
        ) : null}
      </div>

      {/* ===== 會場地點卡（米色外卡，header + 引導圖 + 紅菱形說明） ===== */}
      {meetingLocation || guideImageUrl ? (
        <div className={styles.locationCard}>
          {meetingLocation ? (
            <header className={styles.locationCardHeader}>
              <span className={styles.locationCardIcon} aria-hidden="true">
                <LocationPinIcon />
              </span>
              <span className={styles.locationCardText}>
                {meetingLocationLabel ? (
                  <span className={styles.locationCardTitle}>
                    {meetingLocationLabel}
                  </span>
                ) : null}
                <span className={styles.locationCardSummary}>
                  {meetingLocation}
                </span>
              </span>
            </header>
          ) : null}

          {guideImageUrl ? (
            <figure className={styles.locationFigure}>
              <button
                type="button"
                className={styles.locationImageButton}
                onClick={() =>
                  openImage({
                    path: guideImageUrl,
                    alt: guideImage.alt,
                    caption: Array.isArray(guideImage.captionLines)
                      ? guideImage.captionLines.join(' ')
                      : guideImage.caption,
                  })
                }
                aria-label={`放大檢視：${guideImage.alt || '會場引導圖'}`}
              >
                <img
                  src={guideImageUrl}
                  alt={guideImage.alt || '斗南場會場引導圖'}
                  className={styles.locationImage}
                  loading="lazy"
                />
                <span className={styles.zoomHint} aria-hidden="true">
                  點擊放大
                </span>
              </button>
              {Array.isArray(guideImage.captionLines) && guideImage.captionLines.length > 0 ? (
                <figcaption>
                  <ul className={styles.captionList}>
                    {guideImage.captionLines.map((line, idx) => (
                      <li key={idx} className={styles.captionListItem}>
                        {line}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              ) : guideImage.caption ? (
                <figcaption className={styles.caption}>
                  {guideImage.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      ) : null}

      {/* ===== 地圖按鈕（Google Maps 單顆，置中） ===== */}
      {mapLinks?.googleMaps ? (
        <div className={styles.mapButtonGroup}>
          <MapButton
            provider="google"
            href={mapLinks.googleMaps}
            variant="primary"
          >
            用 Google 地圖帶我去會場！
          </MapButton>
        </div>
      ) : null}

      {/* ===== 補充圖片：map-screenshot、venue-photo ===== */}
      {Array.isArray(supportingImages) && supportingImages.length > 0 ? (
        <div className={styles.supportingGrid}>
          {supportingImages.map((img) => {
            const url = img.path ? assetUrl(img.path) : ''
            if (!url) return null
            return (
              <figure key={img.id} className={styles.figure}>
                <button
                  type="button"
                  className={styles.imageButton}
                  onClick={() =>
                    openImage({
                      path: url,
                      alt: img.alt || img.label,
                      caption: img.label,
                    })
                  }
                  aria-label={`放大檢視：${img.alt || img.label || '場地補充圖'}`}
                >
                  <img
                    src={url}
                    alt={img.alt || img.label || ''}
                    className={styles.image}
                    loading="lazy"
                  />
                  <span className={styles.zoomHint} aria-hidden="true">
                    點擊放大
                  </span>
                </button>
                {img.label ? (
                  <figcaption className={styles.caption}>{img.label}</figcaption>
                ) : null}
              </figure>
            )
          })}
        </div>
      ) : null}

      <ImageLightbox
        isOpen={activeImage !== null}
        imageUrl={activeImage?.path}
        alt={activeImage?.alt || ''}
        caption={activeImage?.caption}
        onClose={handleClose}
      />
    </section>
  )
}

function DiamondDivider() {
  return (
    <span className={styles.diamondDivider} aria-hidden="true">
      <span className={styles.diamondLine} />
      <span className={styles.diamondMark}>◇</span>
      <span className={styles.diamondLine} />
    </span>
  )
}

function LocationPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}
