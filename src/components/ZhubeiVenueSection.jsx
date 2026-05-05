import { useCallback, useState } from 'react'

import { venueZhubei, assetUrl } from '../data/siteData.js'
import MapButton from './MapButton.jsx'
import ImageLightbox from './ImageLightbox.jsx'
import styles from './ZhubeiVenueSection.module.css'

/**
 * ZhubeiVenueSection — 竹北場場地資訊
 *
 * 規格依據：
 *  - ZHUBEI_VENUE_UX_HANDOFF.md（清楚表單式 UX：摘要 → 停車收合 → 入場分流 → 流程步驟）
 *  - project-progress.md Confirmed Decisions §7 / Do Not Override
 *  - visual-style-guide.md（白底、朱紅、細線、活動手冊感）
 *
 * 結構：
 *  1. Hero 兩張並排（Le Phare 室內 + 大樓外觀），點擊放大
 *  2. Summary（venueShortName / venueName / displayAddress）
 *  3. Google Maps 按鈕
 *  4. ParkingAccordion（預設收合）
 *  5. EntryFlowSelector（Radio cards，預設 staffReception）
 *  6. FlowSteps（顯示選中流程的 steps）
 *  7. ImageLightbox
 */

export default function ZhubeiVenueSection({
  id = 'venue',
  title = '場地資訊',
  className = '',
}) {
  const data = venueZhubei ?? {}
  const heroImages = Array.isArray(data.heroImages) ? data.heroImages : []
  const parkingInfo = data.parkingInfo ?? null
  const entryFlows = data.entryFlows ?? null
  const googleMapsHref = data?.mapLinks?.googleMaps ?? ''

  const [activeImage, setActiveImage] = useState(null)
  const handleCloseLightbox = useCallback(() => setActiveImage(null), [])
  const openImage = useCallback(
    (img) => setActiveImage({ path: assetUrl(img.src), alt: img.alt, caption: img.caption }),
    [],
  )

  const [parkingExpanded, setParkingExpanded] = useState(
    Boolean(parkingInfo?.defaultExpanded),
  )
  const toggleParking = useCallback(() => setParkingExpanded((v) => !v), [])

  const flowItems = Array.isArray(entryFlows?.items) ? entryFlows.items : []
  const initialFlowId =
    entryFlows?.defaultFlowId && flowItems.some((f) => f.id === entryFlows.defaultFlowId)
      ? entryFlows.defaultFlowId
      : flowItems[0]?.id ?? ''
  const [selectedFlowId, setSelectedFlowId] = useState(initialFlowId)
  const selectedFlow = flowItems.find((f) => f.id === selectedFlowId) ?? null

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

      {heroImages.length > 0 ? (
        <div className={styles.heroGrid}>
          {heroImages.map((img) => (
            <button
              key={img.src}
              type="button"
              className={styles.heroImageButton}
              onClick={() => openImage(img)}
              aria-label={`放大檢視：${img.alt}`}
            >
              <img
                src={assetUrl(img.src)}
                alt={img.alt}
                className={styles.heroImage}
                loading="lazy"
              />
              <span className={styles.zoomHint} aria-hidden="true">點擊放大</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.summaryText}>
        {data.venueShortName ? (
          <p className={styles.venueShortName}>{data.venueShortName}</p>
        ) : null}
        {data.venueName ? (
          <p className={styles.venueName}>{data.venueName}</p>
        ) : null}
        {data.displayAddress ? (
          <p className={styles.address}>{data.displayAddress}</p>
        ) : null}
      </div>

      {googleMapsHref ? (
        <div className={styles.mapButtons}>
          <MapButton provider="google" href={googleMapsHref} variant="primary">
            用 Google 地圖開啟
          </MapButton>
        </div>
      ) : null}

      {parkingInfo ? (
        <ParkingAccordion
          data={parkingInfo}
          expanded={parkingExpanded}
          onToggle={toggleParking}
          onOpenImage={openImage}
        />
      ) : null}

      {flowItems.length > 0 ? (
        <div className={styles.entrySection}>
          <h3 className={styles.entryHeading}>選擇入場方式</h3>
          <EntryFlowSelector
            flows={flowItems}
            selectedId={selectedFlowId}
            onSelect={setSelectedFlowId}
          />
          {selectedFlow ? (
            <FlowSteps steps={selectedFlow.steps} onOpenImage={openImage} />
          ) : null}
        </div>
      ) : null}

      <ImageLightbox
        isOpen={activeImage !== null}
        imageUrl={activeImage?.path}
        alt={activeImage?.alt || ''}
        caption={activeImage?.caption}
        onClose={handleCloseLightbox}
      />
    </section>
  )
}

function ParkingAccordion({ data, expanded, onToggle, onOpenImage }) {
  const panelId = 'zhubei-parking-panel'
  const buttonId = 'zhubei-parking-toggle'
  const images = Array.isArray(data.images) ? data.images : []

  return (
    <section className={styles.parkingAccordion} aria-labelledby={buttonId}>
      <button
        id={buttonId}
        type="button"
        className={styles.parkingToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.parkingTitle}>{data.title}</span>
        <span
          className={`${styles.parkingChevron} ${expanded ? styles.parkingChevronOpen : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <div id={panelId} className={styles.parkingPanel} hidden={!expanded}>
        {data.summary ? (
          <p className={styles.parkingSummary}>{data.summary}</p>
        ) : null}
        {images.length > 0 ? (
          <div className={styles.parkingImages}>
            {images.map((img) => (
              <button
                key={img.src}
                type="button"
                className={styles.parkingImageButton}
                onClick={() => onOpenImage(img)}
                aria-label={`放大檢視：${img.alt}`}
              >
                <img
                  src={assetUrl(img.src)}
                  alt={img.alt}
                  className={styles.parkingImage}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function EntryFlowSelector({ flows, selectedId, onSelect }) {
  return (
    <div className={styles.flowSelector} role="radiogroup" aria-label="入場方式">
      {flows.map((flow) => {
        const selected = flow.id === selectedId
        return (
          <button
            key={flow.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`${styles.flowCard} ${selected ? styles.flowCardSelected : ''}`}
            onClick={() => onSelect(flow.id)}
          >
            <span className={styles.flowCardRadio} aria-hidden="true">
              <span className={styles.flowCardRadioDot} />
            </span>
            <span className={styles.flowCardText}>
              <span className={styles.flowCardTitle}>{flow.title}</span>
              {flow.summary ? (
                <span className={styles.flowCardSummary}>{flow.summary}</span>
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FlowSteps({ steps, onOpenImage }) {
  if (!Array.isArray(steps) || steps.length === 0) return null
  return (
    <ol className={styles.flowSteps}>
      {steps.map((step, index) => (
        <li key={`${step.title}-${index}`} className={styles.flowStepCard}>
          <header className={styles.flowStepHeader}>
            <span className={styles.flowStepNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4 className={styles.flowStepTitle}>{step.title}</h4>
          </header>
          {step.image ? (
            <button
              type="button"
              className={styles.flowStepImageButton}
              onClick={() => onOpenImage({ src: step.image, alt: step.imageAlt || step.title })}
              aria-label={`放大檢視：${step.imageAlt || step.title}`}
            >
              <img
                src={assetUrl(step.image)}
                alt={step.imageAlt || step.title}
                className={styles.flowStepImage}
                loading="lazy"
              />
            </button>
          ) : null}
          {step.description ? (
            <p className={styles.flowStepDescription}>{step.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
