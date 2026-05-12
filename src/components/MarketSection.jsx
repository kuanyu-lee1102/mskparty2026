import { market } from '../data/siteData.js'
import { assetUrl } from '../data/siteData.js'
import styles from './MarketSection.module.css'

/**
 * MarketSection
 *
 * 「小市集」區塊，斗南 / 竹北場共用。
 *
 * 視覺參考：店家目錄表（左 logo + 右店名與聯絡圖示列），
 * 每家店之間以細線分隔，整體沿用 visual-style-guide.md 的米色 / 朱紅 / 細線語彙。
 *
 * 資料來源：data/market.json
 *  - vendors[].logo 為 null/空時顯示「Logo 待補」placeholder，不可隱藏 logo 欄位
 *  - vendors[].links[] type 對應 facebook / instagram / line / note
 *  - href 缺時只顯示 value 文字（用於 IG 私訊等無連結說明）
 *
 * Props:
 *  - id?: string          可選，section id（給 SectionNav 對應）
 *  - title?: string       可選，覆寫標題；預設讀 market.title
 *  - className?: string   可選，外層 class
 */
export default function MarketSection({ id, title, className = '' }) {
  const data = market || {}
  const heading = title || data.title || '小市集'
  const intro = typeof data.intro === 'string' ? data.intro : ''
  const vendors = Array.isArray(data.vendors) ? data.vendors : []
  const logoPendingLabel =
    typeof data.logoPendingLabel === 'string' && data.logoPendingLabel.length > 0
      ? data.logoPendingLabel
      : 'Logo 待補'

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className={styles.header}>
        <h2 id={id ? `${id}-title` : undefined} className={styles.title}>
          {heading}
        </h2>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      {intro ? <p className={styles.intro}>{intro}</p> : null}

      <ul className={styles.list}>
        {vendors.map((vendor) => (
          <li key={vendor.id} className={styles.item}>
            <VendorRow vendor={vendor} logoPendingLabel={logoPendingLabel} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function VendorRow({ vendor, logoPendingLabel }) {
  const logoSrc = vendor?.logo ? assetUrl(vendor.logo) : ''
  const links = Array.isArray(vendor?.links) ? vendor.links : []

  return (
    <div className={styles.row}>
      <div className={styles.logoWrap} aria-hidden={!logoSrc ? 'true' : undefined}>
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={`${vendor.name} logo`}
            className={styles.logoImg}
            loading="lazy"
          />
        ) : (
          <span className={styles.logoPending}>{logoPendingLabel}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.vendorName}>{vendor.name}</h3>

        {links.length > 0 ? (
          <ul className={styles.linkList}>
            {links.map((link, idx) => (
              <li key={idx} className={styles.linkItem}>
                <LinkRow link={link} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

function LinkRow({ link }) {
  const glyph = getLinkGlyph(link?.type)
  const platform = getPlatformLabel(link?.type, link?.label)
  const value = link?.value || link?.href || ''
  const href = typeof link?.href === 'string' && link.href.length > 0 ? link.href : ''

  return (
    <div className={styles.linkRow}>
      <span
        className={`${styles.linkIcon} ${getIconToneClass(link?.type)}`.trim()}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span className={styles.linkPlatform}>{platform}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkValue}
          aria-label={`${platform}：${value}`}
        >
          <span className={styles.linkValueText}>{value}</span>
          <span className={styles.externalIcon} aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 2.5H2.5v9h9V8.75M8.5 2.5h3v3M11.25 2.75 6 8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      ) : (
        <span className={styles.linkValuePlain}>{value}</span>
      )}
    </div>
  )
}

function getLinkGlyph(type) {
  switch (type) {
    case 'facebook':
      return 'f'
    case 'instagram':
      return '◎'
    case 'line':
      return 'L'
    case 'note':
      return '✎'
    default:
      return '◇'
  }
}

function getPlatformLabel(type, fallbackLabel) {
  switch (type) {
    case 'facebook':
      return 'FB'
    case 'instagram':
      return 'IG'
    case 'line':
      return 'LINE'
    case 'note':
      return fallbackLabel || '訂購方式'
    default:
      return fallbackLabel || ''
  }
}

function getIconToneClass(type) {
  return type === 'note' ? styles.linkIconNeutral : styles.linkIconAccent
}
