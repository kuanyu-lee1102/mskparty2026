import { useMemo, useState, useCallback, useId } from 'react'

import { programsDounan } from '../data/siteData.js'
import { searchPrograms, groupBySession, normalizeQuery } from '../utils/programSearch.js'
import ProgramAccordion, { ProgramItemList } from './ProgramAccordion.jsx'
import styles from './DounanProgramSection.module.css'

/**
 * 老師於 session 內的序號 → 主視覺色 token 映射，呼應節目表海報
 * （source-materials/dounan/programs/dounan-program-01.png）的彩色序號分配：
 *   1: 朱紅, 2: 橘紅, 3: 柔黃, 4: 草地綠, 5: 湖水藍, 6: 藍紫, 7: 深靛紫
 */
const SEQ_COLOR_VARS = [
  'var(--color-vermilion)',
  'var(--color-orange-red)',
  'var(--color-aux-yellow)',
  'var(--color-aux-grass)',
  'var(--color-aux-lake)',
  'var(--color-aux-purple)',
  'var(--color-aux-indigo)',
]

function colorForSeq(seq) {
  const idx = Math.max(0, Math.min(SEQ_COLOR_VARS.length - 1, seq - 1))
  return SEQ_COLOR_VARS[idx]
}

/**
 * DounanProgramSection
 *
 * 斗南場節目表區塊。資料來源唯一為 data/programs.dounan.json。
 *
 * 規格依據：
 *  - event-website-spec.md「節目表 → 斗南場節目表結構 / 節目表 UI 要求 / 節目表搜尋互動」
 *  - engineering-plan.md「節目表搜尋」
 *  - project-progress.md Confirmed Decisions §9 / Do Not Override
 *  - visual-style-guide.md §九「節目 accordion」
 *
 * 兩種顯示模式：
 *
 *  A) 預設 / 清空搜尋：
 *      - 節目資料依 session（上午場 / 下午場）分組
 *      - 每組內依 JSON 順序列出 ProgramAccordion，預設全收起
 *      - 標題 = 老師名稱 + 時間（在 ProgramAccordion 內呈現）
 *
 *  B) 搜尋有結果：
 *      - 不保留完整 accordion 結構
 *      - 顯示「符合搜尋項目的節目」，依老師為群組
 *      - 每組標題顯示 teacherDisplayName + 時段
 *      - 卡片 UI 仍是 ProgramItemList（同一最小單位）
 *
 *  C) 搜尋無結果：
 *      - 顯示「查無結果」+「請確認姓名或曲目是否輸入正確」
 *
 * 搜尋互動：
 *  - blur 觸發（不即時）
 *  - 按 Enter 也觸發（鍵盤友善）
 *  - 清空（trim 後為空字串）→ 回到模式 A
 *  - 大小寫不敏感、忽略前後空白、部分匹配（由 utils/programSearch.js 處理）
 *
 * Props:
 *  - id?: string         section id（建議「program」）
 *  - title?: string      區塊標題，預設「節目表」
 *  - className?: string  外層額外 class
 */
export default function DounanProgramSection({
  id,
  title = '節目表',
  className = '',
}) {
  const allPrograms = Array.isArray(programsDounan?.programs)
    ? programsDounan.programs
    : []

  // inputValue：搜尋欄目前輸入值（每次 keystroke 同步，但不觸發搜尋）
  // appliedQuery：實際被執行的搜尋字串（blur / Enter 後才更新）
  const [inputValue, setInputValue] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')

  const reactId = useId()
  const inputId = `dounan-program-search-${reactId}`
  const helperId = `dounan-program-search-help-${reactId}`

  // session 分組（模式 A 用）
  const sessionGroups = useMemo(
    () => groupBySession(allPrograms),
    [allPrograms],
  )

  // 搜尋結果（模式 B / C 用）
  const searchResults = useMemo(
    () => searchPrograms(allPrograms, appliedQuery),
    [allPrograms, appliedQuery],
  )

  // 老師 → (seq, accent) 映射；session 內順序決定色彩，呼應海報配色
  const teacherColorMap = useMemo(() => {
    const map = new Map()
    sessionGroups.forEach((group) => {
      group.programs.forEach((program, idx) => {
        const seq = idx + 1
        if (program.id) {
          map.set(program.id, { seq, accentColor: colorForSeq(seq) })
        }
      })
    })
    return map
  }, [sessionGroups])

  const normalizedApplied = normalizeQuery(appliedQuery)
  const isSearching = normalizedApplied.length > 0
  const hasResults = searchResults.length > 0

  // ===== Handlers =====
  const handleChange = useCallback((e) => {
    const value = e.target.value
    setInputValue(value)
    // 規格：清空搜尋恢復全部 accordion → 即時偵測「清空」狀態同步觸發
    // （不違反「不即時搜尋」，因為這只是回到 default state，沒有過濾）
    if (value.length === 0) {
      setAppliedQuery('')
    }
  }, [])

  const applySearch = useCallback(() => {
    setAppliedQuery(inputValue)
  }, [inputValue])

  const handleBlur = useCallback(() => {
    applySearch()
  }, [applySearch])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        applySearch()
      }
      // ESC 清空（鍵盤友善的 affordance；不違反規格）
      if (e.key === 'Escape') {
        e.preventDefault()
        setInputValue('')
        setAppliedQuery('')
      }
    },
    [applySearch],
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    setAppliedQuery('')
  }, [])

  // ===== Render =====
  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className={styles.header}>
        <h2 id={id ? `${id}-title` : undefined} className={styles.title}>
          {title}
        </h2>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      {/* ===== 搜尋欄 ===== */}
      <div className={styles.searchWrap} role="search">
        <label htmlFor={inputId} className={styles.searchLabel}>
          搜尋老師、學生或曲目
        </label>
        <div className={styles.searchInputWrap}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id={inputId}
            type="search"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="例如：王大明、卡儂、Candy 蔡老師"
            className={styles.searchInput}
            aria-describedby={helperId}
            autoComplete="off"
            inputMode="search"
          />
          {inputValue.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="清除搜尋"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3.5 3.5l7 7M10.5 3.5l-7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
        <p id={helperId} className={styles.searchHelper}>
          輸入後按 Enter 或點其他地方即可搜尋
        </p>
      </div>

      {/* ===== 內容主體 ===== */}
      {isSearching ? (
        hasResults ? (
          <SearchResults results={searchResults} teacherColorMap={teacherColorMap} />
        ) : (
          <EmptyState />
        )
      ) : (
        <AccordionView sessionGroups={sessionGroups} />
      )}
    </section>
  )
}

/**
 * 模式 A：依 session 分組的 accordion 全資料，預設全收起。
 */
function AccordionView({ sessionGroups }) {
  if (!sessionGroups || sessionGroups.length === 0) {
    return (
      <p className={styles.empty}>節目表資料待補。</p>
    )
  }

  return (
    <div className={styles.sessions}>
      {sessionGroups.map((group) => (
        <div key={group.session} className={styles.sessionGroup}>
          <h3 className={styles.sessionTitle}>
            <span className={styles.sessionLabel}>{group.session}</span>
            {group.sessionStartTime ? (
              <span className={styles.sessionStartTime}>
                {group.sessionStartTime} 起
              </span>
            ) : null}
          </h3>
          <div className={styles.accordionList}>
            {group.programs.map((program, idx) => {
              const seq = idx + 1
              return (
                <ProgramAccordion
                  key={program.id}
                  program={program}
                  seq={seq}
                  accentColor={colorForSeq(seq)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 模式 B：搜尋結果。
 * 規格：「符合搜尋項目的節目」標題 + 依老師分組卡片，不保留完整 accordion。
 * 老師色票套用：teacherColorMap 由 session 內順序預先映射，搜尋結果保留同一色彩語言。
 */
function SearchResults({ results, teacherColorMap }) {
  return (
    <div className={styles.results}>
      <p className={styles.resultsTitle}>符合搜尋項目的節目</p>
      <ul className={styles.resultsList}>
        {results.map(({ program, matchedItems }) => {
          const teacherLabel =
            program.teacherDisplayName || program.teacherName || ''
          const timeRange =
            program.startTime && program.endTime
              ? `${program.startTime} - ${program.endTime}`
              : ''
          const accent = teacherColorMap?.get(program.id)?.accentColor
          const styleVar = accent ? { '--accent-color': accent } : undefined
          return (
            <li
              key={program.id}
              className={styles.resultGroup}
              style={styleVar}
            >
              <h3 className={styles.resultGroupTitle}>
                <span className={styles.resultTeacher}>{teacherLabel}</span>
                {timeRange ? (
                  <>
                    <span className={styles.resultSeparator} aria-hidden="true">
                      ｜
                    </span>
                    <span className={styles.resultTime}>{timeRange}</span>
                  </>
                ) : null}
              </h3>
              <ProgramItemList items={matchedItems} accentColor={accent} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * 模式 C：搜尋無結果。
 * 規格文案：「查無結果」+「請確認姓名或曲目是否輸入正確」。
 */
function EmptyState() {
  return (
    <div className={styles.emptyState} role="status">
      <p className={styles.emptyTitle}>查無結果</p>
      <p className={styles.emptyHelper}>請確認姓名或曲目是否輸入正確</p>
    </div>
  )
}
