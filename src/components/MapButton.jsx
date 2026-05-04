import styles from './MapButton.module.css'

/**
 * MapButton
 *
 * 用於開啟外部地圖（Google Maps / Apple Maps）的連結按鈕。
 *
 * 視覺規範來自 visual-style-guide.md「九、UI 元件方向 - 按鈕」與
 * gemini-visual-prompt.md：朱紅底白字 (primary)、白底朱紅線框 (secondary)。
 * lost variant 用於斗南場「我迷路了」CTA，視覺更醒目（更大、更厚實）。
 *
 * Props:
 * - provider: 'google' | 'apple'   用於決定預設文字與 aria-label 補強（可選）
 * - href: string                   必要，地圖外連網址
 * - variant: 'primary' | 'secondary' | 'lost'
 * - children: ReactNode            按鈕文字（如「用 Google 地圖開啟」）
 * - className: string              額外的外層 className（可選）
 */
export default function MapButton({
  provider,
  href,
  variant = 'primary',
  children,
  className = '',
  ...rest
}) {
  if (!href) return null

  const variantClass =
    variant === 'lost'
      ? styles.lost
      : variant === 'secondary'
        ? styles.secondary
        : styles.primary

  const providerClass = provider ? styles[`provider_${provider}`] : ''

  const ariaLabelFallback =
    provider === 'google'
      ? '使用 Google 地圖開啟'
      : provider === 'apple'
        ? '使用 Apple 地圖開啟'
        : undefined

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.button} ${variantClass} ${providerClass} ${className}`.trim()}
      aria-label={rest['aria-label'] ?? ariaLabelFallback}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      <span className={styles.externalIcon} aria-hidden="true">
        {/* 細線外連 icon，符合「細線」裝飾語言 */}
        <svg
          width="14"
          height="14"
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
  )
}
