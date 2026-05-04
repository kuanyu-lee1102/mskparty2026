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
 * 規格依據：
 *  - event-website-spec.md「2. 場地資訊 → 斗南場場地資訊」
 *      會場引導圖、Google / Apple Maps 按鈕、簡短抵達說明
 *      第一版只需要幫助使用者找到會場，不細分報到區、急救站、補水區、廁所、服務台
 *  - engineering-plan.md 資料對照表：DounanVenueSection 只讀 venue.dounan.json
 *  - visual-style-guide.md §六/§七/§九（卡片）/§十（斗南場可更強調草地、戶外、家庭參與感）
 *  - CLAUDE_CODE_FRONTEND_HANDOFF.md「Component Guidance → Venue Sections」
 *  - project-progress.md Do Not Override：不可用時間表圖片取代場地資訊
 *
 * 顯示順序（由上至下）：
 *  1. 區塊標題「場地資訊」+ 細線分隔
 *  2. 會場名稱、目標區域描述（C 區草地）
 *  3. 顯示地址 + 座標（DMS + 十進位）
 *  4. 引導圖（zone-map）— 有 caption
 *  5. 兩顆地圖按鈕（Google + Apple）
 *  6. 抵達建議（navigationNotes）
 *  7. 補充圖片（map-screenshot、venue-photo）
 *  - 圖片皆可點擊放大（ImageLightbox）
 *
 * Props:
 *  - id?: string         section id，提供給 SectionNav 對應；建議由父層傳入「venue」
 *  - title?: string      區塊標題，預設「場地資訊」
 *  - className?: string  外層額外 class
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
    venueName,
    targetAreaName,
    targetDescription,
    primaryGoal,
    mapLinks,
    guideImage,
    supportingImages,
  } = venueDounan ?? {}

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
        <span className={styles.divider} aria-hidden="true" />
      </header>

      {/* ===== 會場名稱 + 目標區域 ===== */}
      <div className={styles.venueIntro}>
        {venueName ? (
          <p className={styles.venueName}>{venueName}</p>
        ) : null}
        {targetAreaName ? (
          <p className={styles.targetArea}>{targetAreaName}</p>
        ) : null}
        {targetDescription ? (
          <p className={styles.targetDescription}>{targetDescription}</p>
        ) : null}
        {primaryGoal ? (
          <p className={styles.primaryGoal}>{primaryGoal}</p>
        ) : null}
      </div>

      {/* ===== 會場引導圖 ===== */}
      {guideImageUrl ? (
        <figure className={styles.figure}>
          <button
            type="button"
            className={styles.imageButton}
            onClick={() =>
              openImage({
                path: guideImageUrl,
                alt: guideImage.alt,
                caption: guideImage.caption,
              })
            }
            aria-label={`放大檢視：${guideImage.alt || '會場引導圖'}`}
          >
            <img
              src={guideImageUrl}
              alt={guideImage.alt || '斗南場會場引導圖'}
              className={styles.image}
              loading="lazy"
            />
            <span className={styles.zoomHint} aria-hidden="true">
              點擊放大
            </span>
          </button>
          {guideImage.caption ? (
            <figcaption className={styles.caption}>
              {guideImage.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* ===== 地圖按鈕 ===== */}
      {(mapLinks?.googleMaps || mapLinks?.appleMaps) ? (
        <div className={styles.mapButtonGroup}>
          {mapLinks.googleMaps ? (
            <MapButton
              provider="google"
              href={mapLinks.googleMaps}
              variant="primary"
            >
              用 Google 地圖開啟
            </MapButton>
          ) : null}
          {mapLinks.appleMaps ? (
            <MapButton
              provider="apple"
              href={mapLinks.appleMaps}
              variant="secondary"
            >
              用 Apple 地圖開啟
            </MapButton>
          ) : null}
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
