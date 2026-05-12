/**
 * programSearch
 *
 * 斗南場節目表搜尋邏輯。資料來源唯一為 data/programs.dounan.json。
 *
 * 規格依據：
 *  - event-website-spec.md「節目表搜尋互動」：
 *      搜尋範圍 = 老師名稱 + 學生姓名 + 曲目名稱
 *      跨上午場 / 下午場
 *      blur 時觸發（不即時）
 *      清空恢復全部資料
 *      結果以老師為群組，元件不變（序號 + 演出者 + 曲目）
 *      無結果顯示「查無結果」+「請確認姓名或曲目是否輸入正確」
 *  - engineering-plan.md「節目表搜尋」：搜尋僅從同一份 JSON 衍生，不另外維護
 *  - project-progress.md Do Not Override：不即時、不保留完整 accordion
 *
 * 設計細節：
 *  - 大小寫不敏感（toLowerCase）
 *  - 忽略前後空白（trim）
 *  - 部分匹配（contains），不做 fuzzy
 *  - 老師範圍同時匹配 teacherName / teacherDisplayName / teacherLocalName，
 *    確保使用者搜尋「Lucy」「張老師」「Miss. Lucy」皆可命中
 *  - 學生範圍同時匹配 item.performer（顯示字串）以及 item.performers[]（拆分後個別姓名）
 *  - 跨老師插入項目可匹配 item.ownerTeacherDisplayName，避免搜尋原指導老師時漏掉該項
 *  - 曲目範圍匹配 item.title
 *  - 老師命中時：該老師整組 items 顯示
 *  - 學生 / 曲目命中時：只顯示該命中的 item
 *  - 搜尋結果以老師（program）為單位分組，順序保留 JSON 原順序
 *
 * Public API:
 *  - normalizeQuery(raw)
 *  - matchesProgram(query, program) → { matched, matchType, matchedItems }
 *  - searchPrograms(programs, query) → Array<{ program, matchedItems, matchType }>
 *  - groupBySession(programs) → Array<{ session, sessionStartTime, programs }>
 */

const EMPTY_RESULT = []

/**
 * 將使用者輸入字串標準化（trim + toLowerCase）。
 * 空字串 / 非字串都回 ''。
 */
export function normalizeQuery(raw) {
  if (typeof raw !== 'string') return ''
  return raw.trim().toLowerCase()
}

/**
 * 安全取出字串並 lowercase。
 */
function lower(value) {
  return typeof value === 'string' ? value.toLowerCase() : ''
}

/**
 * 老師名稱命中檢查：包含三種顯示形式（英文名、完整顯示名、本地姓氏）。
 */
function teacherFieldMatches(query, program) {
  if (!program) return false
  const candidates = [
    program.teacherName,
    program.teacherDisplayName,
    program.teacherLocalName,
  ]
  return candidates.some((name) => lower(name).includes(query))
}

/**
 * 單一節目項目（item）命中檢查。
 * 命中欄位：performer 顯示字串、performers[] 拆分後的個別姓名、
 * ownerTeacherDisplayName、title。
 */
function itemMatches(query, item) {
  if (!item) return false
  if (lower(item.performer).includes(query)) return true
  if (Array.isArray(item.performers)) {
    if (item.performers.some((name) => lower(name).includes(query))) return true
  }
  if (lower(item.ownerTeacherDisplayName).includes(query)) return true
  if (lower(item.title).includes(query)) return true
  return false
}

/**
 * 對單一 program（一位老師）做匹配。
 *
 * 回傳：
 *  - matched: boolean
 *  - matchType: 'teacher' | 'item' | null
 *      teacher = 老師名稱命中（顯示該老師全部 items）
 *      item    = 學生 / 曲目命中（只顯示命中的 items）
 *      null    = 未命中
 *  - matchedItems: 該 program 應顯示的 items 陣列
 */
export function matchesProgram(query, program) {
  if (!program || !query) {
    return { matched: false, matchType: null, matchedItems: [] }
  }

  const items = Array.isArray(program.items) ? program.items : []

  // 老師命中：整組 items 都顯示
  if (teacherFieldMatches(query, program)) {
    return { matched: true, matchType: 'teacher', matchedItems: items }
  }

  // 否則檢查 items：只回傳命中的 items
  const hits = items.filter((item) => itemMatches(query, item))
  if (hits.length > 0) {
    return { matched: true, matchType: 'item', matchedItems: hits }
  }

  return { matched: false, matchType: null, matchedItems: [] }
}

/**
 * 對整份 programs 陣列做搜尋。
 *
 * 回傳：依 JSON 原順序保留命中的 program；每個元素為
 *  { program, matchedItems, matchType }
 *
 * 規範：query 為空字串時不視為「全部命中」，回傳 EMPTY_RESULT，
 * 由呼叫端決定是否切回 accordion 全資料模式。
 */
export function searchPrograms(programs, rawQuery) {
  const query = normalizeQuery(rawQuery)
  if (query.length === 0) return EMPTY_RESULT
  if (!Array.isArray(programs) || programs.length === 0) return EMPTY_RESULT

  const results = []
  for (const program of programs) {
    const { matched, matchType, matchedItems } = matchesProgram(query, program)
    if (matched) {
      results.push({ program, matchedItems, matchType })
    }
  }
  return results
}

/**
 * 將 programs 依 session（上午場 / 下午場）分組。
 * 用於 accordion 預設顯示模式（搜尋為空時）。
 *
 * 回傳：依首次出現順序保留 session 順序，每組為
 *  { session, sessionStartTime, programs: [program...] }
 */
export function groupBySession(programs) {
  if (!Array.isArray(programs) || programs.length === 0) return []

  const groups = new Map()
  const order = []
  for (const program of programs) {
    const key = program?.session ?? ''
    if (!groups.has(key)) {
      groups.set(key, {
        session: key,
        sessionStartTime: program?.sessionStartTime ?? '',
        programs: [],
      })
      order.push(key)
    }
    groups.get(key).programs.push(program)
  }
  return order.map((k) => groups.get(k))
}
