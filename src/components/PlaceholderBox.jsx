import styles from './PlaceholderBox.module.css'

/**
 * PlaceholderBox
 *
 * 顯示「待補」/「待定」資料的視覺容器。
 * 來源：event-website-spec.md 多處（圖片待補、節目明細待補、LINE ID 待定…）。
 *
 * 視覺基準（visual-style-guide.md）：暖白/米白底、米棕細線框、次要文字色；
 * 不可看起來像 error 紅色警告。
 *
 * Props:
 * - label: string                   顯示的主要文字（如「圖片待補」「待定」）
 * - tone: 'pending' | 'info'        可選，預設 'pending'
 * - children: ReactNode             可選，補充說明（顯示在 label 下方）
 * - className: string               可選，額外的外層 className
 */
export default function PlaceholderBox({
  label,
  tone = 'pending',
  children,
  className = '',
}) {
  const toneClass = tone === 'info' ? styles.info : styles.pending

  return (
    <div
      className={`${styles.box} ${toneClass} ${className}`.trim()}
      role="note"
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {label && <span className={styles.label}>{label}</span>}
      {children && <div className={styles.body}>{children}</div>}
    </div>
  )
}
