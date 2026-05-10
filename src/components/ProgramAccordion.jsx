import { useId, useState, useCallback } from 'react'

import PlaceholderBox from './PlaceholderBox.jsx'
import styles from './ProgramAccordion.module.css'

/**
 * ProgramAccordion
 *
 * 單一老師的折疊列表（accordion）項目。
 *
 * 規格依據：
 *  - event-website-spec.md「節目表 → 斗南場節目表結構」
 *      標題：老師名稱 + 時間（例：Miss. Candy｜10:00 - 10:20）
 *      展開內容：學生節目明細（序號 / 演出者 / 曲目）
 *      預設全收起；缺明細顯示「節目明細待補」
 *  - visual-style-guide.md §九「節目 accordion」
 *      標題列借鑑節目表細線表格感；老師名稱與時間清楚；右側 icon 表示展開
 *      展開內容用節目卡片
 *  - 視覺參考：mockups/program-option-1-accordion-cards.svg
 *      序號 + 老師名 + 時間在標題列；展開卡片白底細線、序號大字、演出者+曲目兩段式
 *  - 海報配色：source-materials/dounan/programs/dounan-program-01.png
 *      session 內各老師依順序對應 7 種色彩（紅/橘/黃/綠/藍/紫/深靛）
 *
 * Props:
 *  - program: object        必填，programs.dounan.json#programs[i]
 *  - seq?: number           老師於 session 內的順序（1-based），用於序號徽章
 *  - accentColor?: string   主色（CSS 色值或 var()），決定序號徽章/卡片邊與展開填色
 *  - isOpen?: boolean       受控 open 狀態（可選）
 *  - defaultOpen?: boolean  非受控初始 open（可選，預設 false）
 *  - onToggle?: (next: boolean) => void  受控 onToggle（可選）
 *  - className?: string
 */
export default function ProgramAccordion({
  program,
  seq,
  accentColor,
  isOpen,
  defaultOpen = false,
  onToggle,
  className = '',
}) {
  const reactId = useId()
  const headerId = `program-accordion-h-${reactId}`
  const panelId = `program-accordion-p-${reactId}`

  const isControlled = typeof isOpen === 'boolean'
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = isControlled ? isOpen : internalOpen

  const handleToggle = useCallback(() => {
    const next = !open
    if (!isControlled) setInternalOpen(next)
    if (typeof onToggle === 'function') onToggle(next)
  }, [open, isControlled, onToggle])

  if (!program) return null

  const teacherLabel = program.teacherDisplayName || program.teacherName || ''
  const timeRange =
    program.startTime && program.endTime
      ? `${program.startTime} - ${program.endTime}`
      : ''

  const items = Array.isArray(program.items) ? program.items : []
  const seqLabel =
    typeof seq === 'number' && seq > 0 ? String(seq).padStart(2, '0') : null

  // 將 accentColor 注入 CSS 自訂屬性，由 module.css 取用
  const containerStyle = accentColor ? { '--accent-color': accentColor } : undefined

  return (
    <div
      className={`${styles.accordion} ${open ? styles.accordionOpen : ''} ${className}`.trim()}
      style={containerStyle}
    >
      <h3 className={styles.headerWrap}>
        <button
          id={headerId}
          type="button"
          className={styles.header}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={handleToggle}
        >
          {seqLabel ? (
            <span className={styles.seqBadge} aria-hidden="true">
              {seqLabel}
            </span>
          ) : null}
          <span className={styles.headerText}>
            <span className={styles.teacher}>{teacherLabel}</span>
            {timeRange ? (
              <span className={styles.time}>{timeRange}</span>
            ) : null}
          </span>
          <span
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={styles.panel}
        hidden={!open}
      >
        <div className={styles.panelInner}>
          {items.length > 0 ? (
            <ProgramItemList items={items} accentColor={accentColor} />
          ) : (
            <PlaceholderBox label="節目明細待補" />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * ProgramItemList
 *
 * 學生節目明細卡片列表（單一老師展開後內容，或搜尋結果中單一群組底下）。
 * 規範：每張卡片包含「序號 / 演出者 / 曲目」三欄；不顯示樂器、合奏標籤等
 *      可選欄位於第一版（保留資料但不顯示，待視覺再決定）。
 * Export 給 DounanProgramSection 搜尋結果群組共用。
 *
 * accentColor 控制序號顏色，呼應海報配色。
 */
export function ProgramItemList({ items, accentColor, className = '' }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <PlaceholderBox label="節目明細待補" />
  }
  const listStyle = accentColor ? { '--accent-color': accentColor } : undefined
  return (
    <ol
      className={`${styles.itemList} ${className}`.trim()}
      style={listStyle}
    >
      {items.map((item, idx) => (
        <li key={`${item.order ?? idx}-${item.performer ?? ''}-${idx}`} className={styles.item}>
          <span className={styles.order}>{item.order ?? '—'}</span>
          <span className={styles.itemDivider} aria-hidden="true" />
          <span className={styles.itemBody}>
            <PerformerCell performer={item.performer} />
            <span className={styles.title}>{item.title || '曲目待補'}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/**
 * 演出者欄位渲染。若 performer 字串為 `(團名) 名1、名2、…` 格式，
 * 解析為團名標籤 + 編號學生名單；否則照原樣顯示。
 * 約定：半形 `(` 開頭、半形 `)` 結尾，名單以「、」「,」「，」分隔。
 */
function PerformerCell({ performer }) {
  const m =
    typeof performer === 'string'
      ? performer.match(/^\(([^)]+)\)\s*(.+)$/)
      : null
  if (!m) {
    return <span className={styles.performer}>{performer || '—'}</span>
  }
  const [, label, rest] = m
  const names = rest
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <span className={styles.performerGroup}>
      <span className={styles.groupLabel}>{label}</span>
      <ol className={styles.groupList}>
        {names.map((n, i) => (
          <li key={`${i}-${n}`}>{n}</li>
        ))}
      </ol>
    </span>
  )
}
