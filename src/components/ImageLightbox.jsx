import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './ImageLightbox.module.css'

/**
 * ImageLightbox
 *
 * 點擊圖片放大顯示的 modal。
 * 來源：event-website-spec.md「時間表」「竹北節目表」與 visual-style-guide.md「九、圖片 lightbox」。
 *
 * 行為：
 * - 圖片完整顯示 (object-fit: contain)，不裁切
 * - 關閉按鈕明顯（朱紅圓形，右上角）
 * - ESC 可關閉
 * - 點背景遮罩可關閉
 * - 開啟時鎖住 body scroll
 * - focus trap：tab 在關閉按鈕內循環
 * - 不做 carousel、不做下載、不做左右切換
 *
 * Props:
 * - isOpen: boolean
 * - imageUrl: string             圖片 URL（呼叫方應已用 assetUrl 處理）
 * - alt: string                  必填，無障礙替代文字
 * - caption?: string             選填，圖片下方說明
 * - onClose: () => void          關閉 callback
 */
export default function ImageLightbox({
  isOpen,
  imageUrl,
  alt,
  caption,
  onClose,
}) {
  const closeButtonRef = useRef(null)
  const previousFocusRef = useRef(null)
  const dialogRef = useRef(null)

  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') onClose()
  }, [onClose])

  // ESC 關閉 + 鎖 body scroll + 進場時 focus close button + 離場時還原 focus
  useEffect(() => {
    if (!isOpen) return undefined

    previousFocusRef.current =
      typeof document !== 'undefined' ? document.activeElement : null

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
        return
      }
      // 簡易 focus trap：只有一個可聚焦元素（關閉按鈕），所以 Tab 永遠停在它身上
      if (e.key === 'Tab') {
        e.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // 進場時把焦點移到關閉按鈕（下一個 tick，確保 portal 已渲染）
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
      document.body.style.overflow = originalOverflow
      // 還原焦點到先前的 trigger
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === 'function'
      ) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, handleClose])

  if (!isOpen || !imageUrl) return null
  if (typeof document === 'undefined') return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={alt || '圖片放大檢視'}
      onClick={handleBackdropClick}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="關閉圖片"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <figure className={styles.figure}>
        <img
          src={imageUrl}
          alt={alt}
          className={styles.image}
          draggable={false}
        />
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    </div>,
    document.body,
  )
}
