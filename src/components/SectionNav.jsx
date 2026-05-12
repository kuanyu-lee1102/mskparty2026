import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './SectionNav.module.css'

/**
 * SectionNav
 *
 * 場次頁的 sticky 橫向 tab 導覽列。點擊 tab 後 smooth scroll 到對應 section，
 * 並在使用者捲動時自動 highlight 目前可視 section。
 *
 * 規格依據：
 *  - event-website-spec.md「活動資訊頁需求 → sticky tab / sticky nav」
 *    斗南場 5 tab（場地資訊 / 時間表 / 節目表 / 我迷路了 / 聯絡我們）
 *    竹北場 4 tab（場地資訊 / 時間表 / 節目表 / 聯絡我們）
 *    導覽列需支援平滑捲動到指定區塊
 *  - visual-style-guide.md §九「Sticky nav」：
 *    手機橫向可滑、暖白或半透明白底、選中狀態使用朱紅底或朱紅底線、不使用深色 navbar
 *  - CLAUDE_CODE_FRONTEND_HANDOFF.md「Mobile-First Requirements」：
 *    sticky nav 應該橫向可滑或可手機點擊；text 不可 overflow
 *
 * 設計重點：
 *  - tabs 由 prop 傳入（不寫死，由 Wave 5 各場次頁決定 tab 集合）
 *  - id 需對應頁面 section 的 DOM id；點擊時用 scrollIntoView 並補償 sticky nav 自身高度
 *  - 預設使用 IntersectionObserver 觀察 section，自動 highlight
 *  - 也支援外部 controlled 的 activeId
 *
 * Props:
 *  - tabs: Array<{ id: string, label: string }>  必填，tab 順序與顯示文字
 *  - activeId?: string                            可選，外部 controlled 的目前 active id
 *  - onTabChange?: (id: string) => void           可選，tab 變動時的回呼
 *  - className?: string                           可選，外層額外 class
 *  - scrollOffset?: number                        可選，scroll 補償高度（預設 16px，加上 nav 自身高度）
 */
export default function SectionNav({
  tabs,
  activeId,
  onTabChange,
  className = '',
  scrollOffset = 16,
}) {
  const safeTabs = useMemo(
    () => (Array.isArray(tabs) ? tabs.filter((t) => t && t.id && t.label) : []),
    [tabs],
  )

  const navRef = useRef(null)
  const tabRefs = useRef(new Map())
  // 點擊 tab 觸發 smooth scroll 期間，鎖住 IntersectionObserver 以免途經 section
  // 把 active 連續改掉造成標籤閃跳。捲動穩定後再解鎖。
  const programmaticScrollRef = useRef(false)
  const unlockTimerRef = useRef(null)
  const [internalActiveId, setInternalActiveId] = useState(
    () => activeId ?? safeTabs[0]?.id ?? '',
  )

  // 若外部 controlled，僅同步外部值；否則內部用 IntersectionObserver 控制
  const isControlled = typeof activeId === 'string' && activeId.length > 0
  const currentActiveId = isControlled ? activeId : internalActiveId

  // ===== 點擊 tab：smooth scroll 到對應 section，補償 sticky nav 高度 =====
  const handleTabClick = useCallback(
    (id) => {
      if (!id) return
      if (!isControlled) setInternalActiveId(id)
      onTabChange?.(id)

      const target = document.getElementById(id)
      if (!target) return

      const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        navHeight -
        scrollOffset

      // 鎖住 observer 後再觸發 smooth scroll，避免途經 section 把 active 改掉
      programmaticScrollRef.current = true
      window.clearTimeout(unlockTimerRef.current)

      // 尊重 prefers-reduced-motion；global.css 已關閉 scroll-behavior
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
      })

      // 捲動完成後解鎖：smooth scroll 通常 < 600ms，給 800ms buffer。
      // 部分瀏覽器（Chrome 114+ / Safari 18+）支援 'scrollend' 事件，可更精準解鎖。
      const onScrollEnd = () => {
        programmaticScrollRef.current = false
        window.removeEventListener('scrollend', onScrollEnd)
      }
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', onScrollEnd, { once: true })
      }
      unlockTimerRef.current = window.setTimeout(() => {
        programmaticScrollRef.current = false
        window.removeEventListener('scrollend', onScrollEnd)
      }, 800)
    },
    [isControlled, onTabChange, scrollOffset],
  )

  // ===== 自動 highlight：IntersectionObserver 觀察各 section =====
  useEffect(() => {
    if (isControlled) return
    if (typeof window === 'undefined') return
    if (safeTabs.length === 0) return

    const sections = safeTabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean)

    if (sections.length === 0) return

    // rootMargin top 補償 sticky nav 自身高度，避免 nav 蓋住 section 時還沒切換
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 56
    const observer = new IntersectionObserver(
      (entries) => {
        // 點擊 tab 的 smooth scroll 期間鎖住，避免途經 section 連續覆蓋 active
        if (programmaticScrollRef.current) return
        // 取最接近頂端、目前可見且交叉比例最高的 section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setInternalActiveId(visible[0].target.id)
        }
      },
      {
        // 上方 root 縮一個 nav 高度 + 16px 緩衝；下方留 60% 視窗讓 active 提早切換
        rootMargin: `-${navHeight + 16}px 0px -60% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [isControlled, safeTabs])

  // 卸載時清掉解鎖計時器
  useEffect(() => {
    return () => {
      window.clearTimeout(unlockTimerRef.current)
    }
  }, [])

  // ===== 當 active 改變時，把該 tab 滑到 nav 視窗中央，避免被裁掉 =====
  useEffect(() => {
    const el = tabRefs.current.get(currentActiveId)
    if (!el) return
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [currentActiveId])

  if (safeTabs.length === 0) return null

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${className}`.trim()}
      aria-label="頁內區塊導覽"
    >
      <ul className={styles.tabList} role="tablist">
        {safeTabs.map((tab) => {
          const isActive = tab.id === currentActiveId
          return (
            <li key={tab.id} className={styles.tabItem} role="presentation">
              <button
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el)
                  else tabRefs.current.delete(tab.id)
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={tab.id}
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`.trim()}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
