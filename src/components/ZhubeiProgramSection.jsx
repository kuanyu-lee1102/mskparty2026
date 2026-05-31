import { useState, useCallback } from 'react'

import { events, assetUrl } from '../data/siteData.js'
import ImageLightbox from './ImageLightbox.jsx'
import PlaceholderBox from './PlaceholderBox.jsx'
import styles from './ZhubeiProgramSection.module.css'

/**
 * ZhubeiProgramSection
 *
 * 竹北場節目表 — 直接呈現單張節目表圖片，下方預留少量說明空間。
 *
 * 規格依據：
 *  - event-website-spec.md「4. 節目表 → 竹北場節目表結構」：
 *    「直接在節目表區塊呈現單張節目表圖片即可，需預留少量文字說明空間」
 *    圖片需完整顯示、可點擊放大、提供明顯關閉按鈕、提供替代文字「竹北場節目表」、
 *    第一版說明顯示「節目表說明待補」
 *  - event-website-spec.md：竹北場「不需要節目搜尋欄位」、
 *    「不需要從 data/programs.dounan.json 或其他 programs JSON 讀取節目資料」
 *  - engineering-plan.md 資料對照表：
 *    ZhubeiProgramSection 引用素材
 *    `source-materials/zhubei/programs/zhubei-program-sheet-01.png`，
 *    實作時複製到 public/assets 後引用公開路徑（assetUrl 處理）。
 *  - project-progress.md Do Not Override：
 *    不為竹北節目表建立 programs JSON 或搜尋欄；不做 accordion；不從 dounan json 讀。
 *  - visual-style-guide.md §九「圖片 lightbox」/§十「節目表」/§六色彩 / §七字體
 *
 * 資料邊界：
 *  - 圖片路徑優先取 events.json#routes.events[id=zhubei].programImage
 *    （fallback 至 hardcode 路徑，避免 JSON 漏設定時整塊壞掉）
 *  - 不引用任何 programs JSON
 *
 * Props:
 *  - id?: string         section id（給 SectionNav 使用），預設 'program'
 *  - title?: string      區塊標題，預設「節目表」
 *  - className?: string  外層額外 class
 */

const ZHUBEI_PROGRAM_FALLBACK_PATH =
  'source-materials/zhubei/programs/zhubei-program-sheet-01.png'

const ZHUBEI_PROGRAM_ALT = '竹北場節目表'
const ZHUBEI_PROGRAM_DESCRIPTION_PENDING = '節目表說明待補'

function findZhubeiProgramImagePath() {
  const list = Array.isArray(events?.routes?.events) ? events.routes.events : []
  const entry = list.find((e) => e?.id === 'zhubei')
  const candidate = entry?.programImage
  if (typeof candidate === 'string' && candidate.length > 0) return candidate
  return ZHUBEI_PROGRAM_FALLBACK_PATH
}

// 節目表下方說明文字：優先讀 events.json#routes.events[id=zhubei].programNote，
// 有值時顯示正式說明（如節目異動公告），無值則 fallback 至「節目表說明待補」placeholder。
function findZhubeiProgramNote() {
  const list = Array.isArray(events?.routes?.events) ? events.routes.events : []
  const entry = list.find((e) => e?.id === 'zhubei')
  const candidate = entry?.programNote
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate.trim()
  }
  return ''
}

// 開場演出：讀 events.json#routes.events[id=zhubei].programOpenings。
// 視覺沿用竹北 venue「入場方式」的米色色塊區塊 + 朱紅編號白卡語言。
// 無 items 時不渲染整塊（不放 placeholder，避免無資料時佔版面）。
function findZhubeiProgramOpenings() {
  const list = Array.isArray(events?.routes?.events) ? events.routes.events : []
  const entry = list.find((e) => e?.id === 'zhubei')
  const openings = entry?.programOpenings
  const items = Array.isArray(openings?.items) ? openings.items.filter((it) => it && it.performer) : []
  if (items.length === 0) return null
  return {
    title: typeof openings.title === 'string' ? openings.title : '開場演出',
    summary: typeof openings.summary === 'string' ? openings.summary : '',
    items,
  }
}

function MusicNoteIcon() {
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
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function OpeningPerformances({ data }) {
  return (
    <div className={styles.openingBanner}>
      <header className={styles.openingHeader}>
        <span className={styles.openingHeaderIcon} aria-hidden="true">
          <MusicNoteIcon />
        </span>
        <span className={styles.openingHeaderText}>
          <span className={styles.openingHeaderTitle}>{data.title}</span>
          {data.summary ? (
            <span className={styles.openingHeaderSummary}>{data.summary}</span>
          ) : null}
        </span>
      </header>
      <ol className={styles.openingList}>
        {data.items.map((item, index) => (
          <li key={`${item.performer}-${index}`} className={styles.openingCard}>
            <span className={styles.openingNumber} aria-hidden="true">
              {index + 1}
            </span>
            <div className={styles.openingTextWrap}>
              <p className={styles.openingPerformer}>{item.performer}</p>
              {item.piece || item.pieceLocal ? (
                <p className={styles.openingPiece}>
                  {item.piece ? (
                    <span className={styles.openingPieceMain}>{item.piece}</span>
                  ) : null}
                  {item.pieceLocal ? (
                    <span className={styles.openingPieceLocal}>{item.pieceLocal}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function ZhubeiProgramSection({
  id = 'program',
  title = '節目表',
  className = '',
}) {
  const [isLightboxOpen, setLightboxOpen] = useState(false)

  const imagePath = findZhubeiProgramImagePath()
  const imageUrl = assetUrl(imagePath)
  const programNote = findZhubeiProgramNote()
  const openings = findZhubeiProgramOpenings()

  const handleOpen = useCallback(() => setLightboxOpen(true), [])
  const handleClose = useCallback(() => setLightboxOpen(false), [])

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

      {openings ? <OpeningPerformances data={openings} /> : null}

      <figure className={styles.figure}>
        <button
          type="button"
          className={styles.imageButton}
          onClick={handleOpen}
          aria-label={`放大檢視：${ZHUBEI_PROGRAM_ALT}`}
        >
          <img
            src={imageUrl}
            alt={ZHUBEI_PROGRAM_ALT}
            className={styles.image}
            loading="lazy"
          />
          <span className={styles.zoomHint} aria-hidden="true">
            點擊放大
          </span>
        </button>
      </figure>

      {/* 圖片下方說明區：programNote 有值時顯示正式說明（如節目異動公告），
          無值則 fallback 至「節目表說明待補」placeholder（規格第一版預設）。 */}
      <div className={styles.descriptionWrap}>
        {programNote ? (
          <p className={styles.note}>{programNote}</p>
        ) : (
          <PlaceholderBox label={ZHUBEI_PROGRAM_DESCRIPTION_PENDING} tone="info" />
        )}
      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        imageUrl={imageUrl}
        alt={ZHUBEI_PROGRAM_ALT}
        onClose={handleClose}
      />
    </section>
  )
}
