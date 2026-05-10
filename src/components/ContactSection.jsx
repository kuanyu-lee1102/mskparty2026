import { contacts } from '../data/siteData.js'
import PlaceholderBox from './PlaceholderBox.jsx'
import styles from './ContactSection.module.css'

/**
 * ContactSection
 *
 * 「聯絡我們」區塊，斗南 / 竹北場共用。
 *
 * 規格依據：
 *  - event-website-spec.md「6. 聯絡我們」：顯示 LINE 官方帳號 / Facebook / LINE ID / 電話。
 *    聯絡資訊必須統一從 data/contacts.json 讀取，不可在 ContactSection 或頁面元件
 *    中另外 hardcode 第二份聯絡資料。
 *  - project-progress.md Confirmed Decisions §11 Contacts：未補連結時仍顯示該項目與「待補」文字，不隱藏。
 *  - project-progress.md Do Not Override：不可隱藏 missing-but-expected contact rows。
 *  - visual-style-guide.md §九 卡片：白 / 暖白底、米棕細線、輕陰影。
 *
 * 資料邏輯：
 *  - 走訪 contacts.items[]：
 *    - status: "ready"  + linkBehavior: "link"        → 可點擊外連 / tel: 連結
 *    - status: "pending" + linkBehavior: "show-pending" → 顯示項目名稱 + 「待定/待補」（PlaceholderBox）
 *  - LINE ID 待定也仍顯示項目，不整列隱藏。
 *
 * Props:
 *  - id?: string             可選，section id（用於 SectionNav 對應）；未傳時不設定 id，由父層自行包 wrapper
 *  - title?: string          可選，section 標題，預設「聯絡我們」
 *  - className?: string      可選，外層額外 class
 */
export default function ContactSection({
  id,
  title = '聯絡我們',
  className = '',
}) {
  const items = Array.isArray(contacts?.items) ? contacts.items : []
  const directoryGroups = Array.isArray(contacts?.directoryGroups)
    ? contacts.directoryGroups
    : []
  const pendingText =
    typeof contacts?.pendingDisplayText === 'string' && contacts.pendingDisplayText.length > 0
      ? contacts.pendingDisplayText
      : '待補'

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className={styles.header}>
        <h2
          id={id ? `${id}-title` : undefined}
          className={styles.title}
        >
          {title}
        </h2>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      {directoryGroups.length > 0 ? (
        <ContactDirectory groups={directoryGroups} items={items} pendingText={pendingText} />
      ) : (
        <ContactList items={items} pendingText={pendingText} />
      )}
    </section>
  )
}

function ContactDirectory({ groups, items, pendingText }) {
  return (
    <div className={styles.directoryStack}>
      {groups.map((group) => (
        <section key={group.id} className={styles.contactGroup}>
          <h3 className={styles.groupTitle}>{group.label}</h3>
          <ContactList items={getItemsByIds(items, group.itemIds)} pendingText={pendingText} />
        </section>
      ))}
    </div>
  )
}

function ContactList({ items, pendingText }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <ContactRow item={item} pendingText={pendingText} />
        </li>
      ))}
    </ul>
  )
}

function getItemsByIds(items, itemIds = []) {
  return itemIds
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter(Boolean)
}

/**
 * 單一聯絡項目的列。
 * - linkBehavior: 'link'         → 顯示 label + 可點擊的值（外連則 target=_blank）
 * - linkBehavior: 'show-pending' → 顯示 label + PlaceholderBox（顯示 value 或 pendingText）
 */
function ContactRow({ item, pendingText }) {
  const isLink =
    item?.status === 'ready' &&
    item?.linkBehavior === 'link' &&
    typeof item?.href === 'string' &&
    item.href.length > 0

  const isPending = item?.linkBehavior === 'show-pending' || item?.status === 'pending'

  if (isLink) {
    const isExternal = !item.href.startsWith('tel:') && !item.href.startsWith('mailto:')
    const ariaLabel = `${item.label}：${item.value}`
    const platformLabel = item.platformLabel || item.label
    const contextLabel = item.contextLabel || item.value
    return (
      <div className={styles.row}>
        <span className={styles.iconMark} aria-hidden="true">
          {getContactGlyph(platformLabel)}
        </span>
        <div className={styles.labelGroup}>
          <span className={styles.label}>{platformLabel}</span>
          {contextLabel ? <span className={styles.context}>{contextLabel}</span> : null}
        </div>
        <a
          href={item.href}
          className={styles.value}
          aria-label={ariaLabel}
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          <span className={styles.valueText}>{getActionLabel(item)}</span>
          {isExternal ? (
            <span className={styles.externalIcon} aria-hidden="true">
              {/* 細線外連 icon，與 MapButton 維持一致語言 */}
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
          ) : null}
        </a>
      </div>
    )
  }

  if (isPending) {
    // 顯示項目名稱 + 「待定 / 待補」說明，使用 PlaceholderBox（不可 inline 重做）
    // 若 JSON 已給 value（例如「待定」），優先顯示該文字，否則 fallback 到 pendingText（「待補」）
    const placeholderLabel =
      typeof item.value === 'string' && item.value.length > 0
        ? item.value
        : pendingText
    return (
      <div className={styles.row}>
        <span className={styles.iconMark} aria-hidden="true">
          {getContactGlyph(item.platformLabel || item.label)}
        </span>
        <div className={styles.labelGroup}>
          <span className={styles.label}>{item.platformLabel || item.label}</span>
          {item.contextLabel ? <span className={styles.context}>{item.contextLabel}</span> : null}
        </div>
        <div className={styles.placeholderWrap}>
          <PlaceholderBox label={placeholderLabel} tone="info" />
        </div>
      </div>
    )
  }

  // 其他未知狀態：保守顯示為純文字值（仍不隱藏）
  return (
    <div className={styles.row}>
      <span className={styles.iconMark} aria-hidden="true">
        {getContactGlyph(item.platformLabel || item.label)}
      </span>
      <div className={styles.labelGroup}>
        <span className={styles.label}>{item.platformLabel || item.label}</span>
        {item.contextLabel ? <span className={styles.context}>{item.contextLabel}</span> : null}
      </div>
      <span className={styles.value}>
        <span className={styles.valueText}>{item.value ?? pendingText}</span>
      </span>
    </div>
  )
}

function getActionLabel(item) {
  if (item?.href?.startsWith('tel:')) return item.value
  return '開啟'
}

function getContactGlyph(label = '') {
  const normalized = label.toLowerCase()

  if (normalized.includes('line')) return 'L'
  if (normalized.includes('facebook')) return 'f'
  if (normalized.includes('instagram')) return '◎'
  if (label.includes('電話')) return '☎'

  return label.slice(0, 1)
}
