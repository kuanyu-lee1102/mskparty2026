import { useState, useCallback } from 'react'
import ImageLightbox from './ImageLightbox'
import styles from './ScheduleImageGallery.module.css'

/**
 * ScheduleImageGallery
 *
 * 時間表圖片展示元件。斗南/竹北兩場皆使用。
 * 來源：data/schedules.public.json 的 images[]，呼叫方應已 assetUrl() 處理過 path。
 *
 * 規範對齊：
 * - event-website-spec.md「3. 時間表」：手機版滿版、不裁切、可點擊放大、無 carousel/下載
 * - schedules.public.json renderingGuidance.imageBehavior
 * - 雙重保險：內部仍會以 audience === 'participant' 過濾，避免老師版意外洩漏
 *
 * Props:
 * - images: Array<{
 *     id: string,
 *     path: string,            // 已 assetUrl() 處理的可公開 URL
 *     alt: string,
 *     caption?: string,
 *     audience?: string,       // 'participant' | 'teacher' | …
 *   }>
 * - className?: string
 */
export default function ScheduleImageGallery({ images = [], className = '' }) {
  const [activeImage, setActiveImage] = useState(null)

  // 雙重保險：只顯示參加者版圖片
  const visibleImages = images.filter(
    (img) => !img.audience || img.audience === 'participant',
  )

  const handleOpen = useCallback((image) => {
    setActiveImage(image)
  }, [])

  const handleClose = useCallback(() => {
    setActiveImage(null)
  }, [])

  if (visibleImages.length === 0) return null

  return (
    <div className={`${styles.gallery} ${className}`.trim()}>
      {visibleImages.map((image) => (
        <figure key={image.id} className={styles.figure}>
          <button
            type="button"
            className={styles.imageButton}
            onClick={() => handleOpen(image)}
            aria-label={`放大檢視：${image.alt || image.caption || '時間表圖片'}`}
          >
            <img
              src={image.path}
              alt={image.alt || ''}
              className={styles.image}
              loading="lazy"
            />
            <span className={styles.zoomHint} aria-hidden="true">
              點擊放大
            </span>
          </button>
          {image.caption && (
            <figcaption className={styles.caption}>{image.caption}</figcaption>
          )}
        </figure>
      ))}

      <ImageLightbox
        isOpen={activeImage !== null}
        imageUrl={activeImage?.path}
        alt={activeImage?.alt || ''}
        caption={activeImage?.caption}
        onClose={handleClose}
      />
    </div>
  )
}
