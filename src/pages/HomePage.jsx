import { Link } from 'react-router-dom'

import { events } from '../data/siteData.js'
import styles from './HomePage.module.css'

// 首頁所有顯示文字一律從 data/events.json 讀取，不在元件中 hardcode
// 規格依據：
//  - event-website-spec.md「首頁需求」
//  - visual-style-guide.md §五（首頁方向）、§十（頁面套用建議 - 首頁）
//  - project-progress.md Do Not Override：禁止首頁 hardcode 第二份品牌資料

const PLANT_ORNAMENT_URL = `${import.meta.env.BASE_URL}assets/brand/plant-ornament.png`
const LOGO_URL = `${import.meta.env.BASE_URL}assets/brand/museeksoul-logo.jpg`

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

// 將 ISO 日期格式化為「YYYY 年 M 月 D 日（週X）」中文呈現
// 規格未明確指定首頁日期格式，第一版採此格式以維持節目冊感；待使用者確認
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
  // 用 UTC 避開時區把日期向前/後挪
  const date = new Date(Date.UTC(year, month - 1, day))
  const weekday = WEEKDAY_LABELS[date.getUTCDay()] ?? ''
  return {
    chinese: `${year} 年 ${month} 月 ${day} 日（週${weekday}）`,
    iso: isoDate,
  }
}

export default function HomePage() {
  const { brand, event, routes } = events
  const eventEntries = Array.isArray(routes?.events) ? routes.events : []

  return (
    <main className={styles.page}>
      {/* 角落細線植物裝飾（左上）— 規格依據 visual-style-guide §八 */}
      <img
        src={PLANT_ORNAMENT_URL}
        alt=""
        aria-hidden="true"
        className={`${styles.cornerOrnament} ${styles.cornerTopLeft}`}
      />

      {/* 角落品牌 logo（右下）— 取代鋼琴線稿，更直接呼應品牌識別 */}
      <img
        src={LOGO_URL}
        alt="Museeksoul 惠歆音樂社 標誌"
        className={`${styles.cornerOrnament} ${styles.cornerBottomRight}`}
      />

      <div className={styles.inner}>
        {/* 品牌儀式感區塊：品牌 / 年份 / 活動名稱 / 副標 */}
        <header className={styles.brandHeader}>
          <p className={styles.brandName}>{brand.displayName}</p>

          <div className={styles.titleGroup}>
            <span className={styles.year} aria-label={`年份 ${event.year}`}>
              {event.year}
            </span>
            <span className={styles.titleDivider} aria-hidden="true" />
            <h1 className={styles.eventTitle}>{event.title}</h1>
          </div>

          <p className={styles.subtitle}>{event.subtitle}</p>
        </header>

        {/* 場次入口：兩個大卡片連結 */}
        <nav className={styles.eventList} aria-label="選擇場次">
          {eventEntries.map((entry) => {
            const { chinese, iso } = formatChineseDate(entry.date)
            return (
              <Link
                key={entry.id}
                to={entry.route}
                className={styles.eventCard}
                aria-label={`進入 ${entry.displayName}，${chinese || iso}`}
              >
                <span className={styles.eventCardLabel}>場次</span>
                <span className={styles.eventCardName}>{entry.displayName}</span>
                <span className={styles.eventCardDate}>
                  {chinese || iso}
                </span>
                <span className={styles.eventCardArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            )
          })}
        </nav>

        {/* 活動主題句呼吸區 */}
        {event.themeLine ? (
          <footer className={styles.themeWrap}>
            <span className={styles.themeRule} aria-hidden="true" />
            <p className={styles.themeLine}>{event.themeLine}</p>
            <span className={styles.themeRule} aria-hidden="true" />
          </footer>
        ) : null}
      </div>
    </main>
  )
}
