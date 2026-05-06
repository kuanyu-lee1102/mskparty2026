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
        <DiamondDivider />
      </header>

      {heroImages.length > 0 ? (
        <div className={styles.heroSingle}>
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
        {data.venueName || data.displayAddress ? (
          <p className={styles.venueLine}>
            {data.venueName ? (
              <span className={styles.venueName}>{data.venueName}</span>
            ) : null}
            {data.venueName && data.displayAddress ? (
              <span className={styles.venueLineSeparator} aria-hidden="true">｜</span>
            ) : null}
            {data.displayAddress ? (
              <span className={styles.address}>{data.displayAddress}</span>
            ) : null}
          </p>
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
          <SectionTitle>選擇入場方式</SectionTitle>
          <EntryFlowSelector
            flows={flowItems}
            selectedId={selectedFlowId}
            onSelect={setSelectedFlowId}
          />
          {selectedFlow ? (
            <SelectedFlowBanner flow={selectedFlow}>
              <FlowSteps steps={selectedFlow.steps} onOpenImage={openImage} />
            </SelectedFlowBanner>
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
        {data.icon ? (
          <span className={styles.parkingIcon} aria-hidden="true">
            <img src={assetUrl(data.icon)} alt="" className={styles.parkingIconImage} />
          </span>
        ) : null}
        <span className={styles.parkingHeaderText}>
          <span className={styles.parkingTitle}>{data.title}</span>
          {data.summary ? (
            <span className={styles.parkingSubtitle}>{data.summary}</span>
          ) : null}
        </span>
        <span
          className={`${styles.parkingChevron} ${expanded ? styles.parkingChevronOpen : ''}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {expanded ? (
        <div id={panelId} className={styles.parkingPanel}>
          {images.length > 0 ? (
            <div className={styles.parkingImages}>
              {images.map((img) => (
                <figure key={img.src} className={styles.parkingImageFigure}>
                  <button
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
                  {Array.isArray(img.captionLines) && img.captionLines.length > 0 ? (
                    <ul className={styles.parkingCaption}>
                      {img.captionLines.map((line, idx) => (
                        <li key={idx} className={styles.parkingCaptionItem}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function FlowIcon({ flowId }) {
  if (flowId === 'staffReception') {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 16c1.2-2 3-3 5-3s3.8 1 5 3" />
    </svg>
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
            className={`${styles.flowButton} ${selected ? styles.flowButtonSelected : ''}`}
            onClick={() => onSelect(flow.id)}
          >
            <span className={styles.flowButtonIcon}>
              <FlowIcon flowId={flow.id} />
            </span>
            <span className={styles.flowButtonLabel}>{flow.title}</span>
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
              {index + 1}
            </span>
            <h4 className={styles.flowStepTitle}>{step.title}</h4>
          </header>
          <div className={styles.flowStepBody}>
            {step.description ? (
              <p className={styles.flowStepDescription}>{step.description}</p>
            ) : null}
            {step.image ? (
              <button
                type="button"
                className={styles.flowStepImageButton}
                onClick={() =>
                  onOpenImage({ src: step.image, alt: step.imageAlt || step.title })
                }
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
          </div>
        </li>
      ))}
    </ol>
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

function SectionTitle({ children }) {
  return (
    <div className={styles.sectionTitleRow}>
      <span className={styles.sectionTitleLine} aria-hidden="true" />
      <span className={styles.sectionTitleMark} aria-hidden="true">◇</span>
      <h3 className={styles.sectionTitleText}>{children}</h3>
      <span className={styles.sectionTitleMark} aria-hidden="true">◇</span>
      <span className={styles.sectionTitleLine} aria-hidden="true" />
    </div>
  )
}

function SelectedFlowBanner({ flow, children }) {
  return (
    <div className={styles.flowBanner}>
      <header className={styles.flowBannerHeader}>
        <span className={styles.flowBannerIcon} aria-hidden="true">
          <FlowIcon flowId={flow.id} />
        </span>
        <span className={styles.flowBannerText}>
          <span className={styles.flowBannerTitle}>{flow.title}流程</span>
          {flow.summary ? (
            <span className={styles.flowBannerSummary}>{flow.summary}</span>
          ) : null}
        </span>
      </header>
      {children}
    </div>
  )
}
