import { Link } from 'react-router-dom'

import { events } from '../data/siteData.js'
import styles from './EventHero.module.css'

/**
 * EventHero
 *
 * 活動資訊頁最頂部的「場次標題 + 返回首頁」區塊。
 *
 * 規格依據：
 *  - event-website-spec.md「活動資訊頁需求 → 1. 頁面頂部資訊」
 *    （場次名稱、簡短說明、醒目的返回首頁按鈕或連結）
 *  - CLAUDE_CODE_FRONTEND_HANDOFF.md「Page Model → Dounan/Zhubei Event Page → Event top / hero」
 *  - visual-style-guide.md §五（首頁方向）/§七（字體：宋體大標題）/§十一（避免事項：不深色 navbar、不海報密集）
 *  - project-progress.md Do Not Override：場次資料來源為 data/events.json，不可 hardcode 第二份
 *
 * 資料邊界：
 *  - 主要使用方式為傳入 eventId（'dounan' | 'zhubei'），元件自行從 events.json
 *    `routes.events[]` 找出 displayName / date / route。
 *  - 也允許呼叫端覆寫 displayName / date / backHref（Wave 5 若已自己讀好，可直接傳入）。
 *  - subtitle 為可選；若未傳，使用 events.json 的 event.subtitle 作為 fallback。
 *
 * Props:
 *  - eventId?: 'dounan' | 'zhubei'   建議用法：以 id 對應到 routes.events[]
 *  - displayName?: string            可選，覆寫場次顯示名稱
 *  - date?: string                   可選，ISO 日期字串（YYYY-MM-DD）
 *  - subtitle?: string               可選，場次下方說明文字（不傳則使用 events.json 全站副標）
 *  - backHref?: string               可選，返回連結，預設為 '/'
 *  - backLabel?: string              可選，返回連結文字，預設「返回首頁」
 */

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

// 與 HomePage 維持一致的中文日期呈現格式（YYYY 年 M 月 D 日（週X））
// 規格未明確指定 hero 日期格式，採與首頁一致以保持節目冊感；待使用者確認
function formatChineseDate(isoDate) {
  if (typeof isoDate !== 'string' || isoDate.length === 0) {
    return { chinese: '', iso: '' }
  }
  const [yearStr, monthStr, dayStr] = isoDate.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)
  if (!year || !month || !day) {
    return { chinese: '', iso: isoDate }
  }
  const date = new Date(Date.UTC(year, month - 1, day))
  const weekday = WEEKDAY_LABELS[date.getUTCDay()] ?? ''
  return {
    chinese: `${year} 年 ${month} 月 ${day} 日（週${weekday}）`,
    iso: isoDate,
  }
}

function findEventEntry(eventId) {
  if (!eventId) return null
  const list = Array.isArray(events?.routes?.events) ? events.routes.events : []
  return list.find((entry) => entry.id === eventId) ?? null
}

export default function EventHero({
  eventId,
  displayName,
  date,
  subtitle,
  backHref = '/',
  backLabel = '返回首頁',
}) {
  const entry = findEventEntry(eventId)

  const finalDisplayName = displayName ?? entry?.displayName ?? ''
  const finalDate = date ?? entry?.date ?? ''
  const finalSubtitle = subtitle ?? events?.event?.subtitle ?? ''
  const eventDisplayTitle = events?.event?.displayTitle ?? ''

  const { chinese: chineseDate, iso: isoDate } = formatChineseDate(finalDate)

  return (
    <header className={styles.hero}>
      {/* 返回首頁連結：放在最上方，符合手機使用者由上往下閱讀的順序 */}
      <Link
        to={backHref}
        className={styles.backLink}
        aria-label={backLabel}
      >
        <span className={styles.backArrow} aria-hidden="true">
          ←
        </span>
        <span className={styles.backText}>{backLabel}</span>
      </Link>

      {/* 活動名稱（小字、來自 events.json，不重複品牌） */}
      {eventDisplayTitle ? (
        <p className={styles.eventTitle}>{eventDisplayTitle}</p>
      ) : null}

      {/* 場次名稱：宋體大標題 */}
      {finalDisplayName ? (
        <h1 className={styles.sectionName}>{finalDisplayName}</h1>
      ) : null}

      {/* 細線分隔（呼應視覺指南的「細線分隔與菱形點」） */}
      <span className={styles.divider} aria-hidden="true" />

      {/* 日期（語意上以 <time> 提供 machine-readable 值） */}
      {chineseDate ? (
        <time className={styles.date} dateTime={isoDate}>
          {chineseDate}
        </time>
      ) : null}

      {/* 副標：簡短說明 */}
      {finalSubtitle ? (
        <p className={styles.subtitle}>{finalSubtitle}</p>
      ) : null}
    </header>
  )
}
