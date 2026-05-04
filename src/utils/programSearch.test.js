import { describe, it, expect } from 'vitest'

import {
  normalizeQuery,
  matchesProgram,
  searchPrograms,
  groupBySession,
} from './programSearch.js'

/**
 * 測試對應規格：
 *  - event-website-spec.md「節目表搜尋互動」
 *  - engineering-plan.md「節目表搜尋」
 *  - project-progress.md Confirmed Decisions §9 / Do Not Override
 *
 * 涵蓋情境：
 *  1. 空字串 / null / undefined 不應命中任何結果（由呼叫端切回 accordion）
 *  2. 大小寫不敏感
 *  3. 前後空白忽略
 *  4. 老師英文名 / 完整顯示名 / 本地姓氏 都可命中
 *  5. 學生姓名（performer）命中
 *  6. 學生姓名（performers[] 陣列）命中
 *  7. 曲目命中
 *  8. 老師命中時整組 items 顯示；學生 / 曲目命中只顯示對應 items
 *  9. 跨上午 / 下午場搜尋
 * 10. 同一學生跨多位老師時，每位老師都應出現一筆群組
 * 11. 部分匹配（contains）
 * 12. 無命中回空陣列
 * 13. 結果順序維持 JSON 原順序
 * 14. groupBySession 將 programs 依 session 分組並保留順序
 * 15. 規格範例：王錦聰 / 吳映潔
 */

const fixturePrograms = [
  {
    id: 'morning-candy',
    session: '上午場',
    sessionStartTime: '10:00',
    teacherName: 'Miss. Candy',
    teacherDisplayName: 'Miss. Candy 蔡老師',
    teacherLocalName: '蔡老師',
    items: [
      { order: '01', performer: '鍵盤團班', performers: ['何禹昕', '高筠晴'], title: '小星星' },
      { order: '03', performer: '吳映潔', title: '再見的時候' },
    ],
  },
  {
    id: 'morning-lucy',
    session: '上午場',
    sessionStartTime: '10:00',
    teacherName: 'Miss. Lucy',
    teacherDisplayName: 'Miss. Lucy 張老師',
    teacherLocalName: '張老師',
    items: [
      { order: '03', performer: '王錦聰', title: 'My heart will go on' },
      { order: '06', performer: '王錦聰', title: '卡農' },
      { order: '07', performer: '顏宇潔', title: 'Windy Hill' },
    ],
  },
  {
    id: 'afternoon-ben',
    session: '下午場',
    sessionStartTime: '13:30',
    teacherName: 'Mr. Ben',
    teacherDisplayName: 'Mr. Ben 廖老師',
    teacherLocalName: '廖老師',
    items: [
      { order: '01', performer: '吳映潔', title: '理想混蛋-平衡木' },
    ],
  },
  {
    id: 'afternoon-yang',
    session: '下午場',
    sessionStartTime: '13:30',
    teacherName: 'Mr. Yang',
    teacherDisplayName: 'Mr. Yang 李老師',
    teacherLocalName: '李老師',
    items: [
      { order: '05', performer: '楊楷定父子', title: '物語' },
    ],
  },
]

describe('normalizeQuery', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeQuery('  Lucy  ')).toBe('lucy')
  })

  it('returns empty string for non-strings', () => {
    expect(normalizeQuery(null)).toBe('')
    expect(normalizeQuery(undefined)).toBe('')
    expect(normalizeQuery(123)).toBe('')
  })

  it('returns empty string for empty / whitespace-only input', () => {
    expect(normalizeQuery('')).toBe('')
    expect(normalizeQuery('   ')).toBe('')
  })
})

describe('searchPrograms — empty query', () => {
  it('returns empty array for empty string (caller should fall back to accordion)', () => {
    expect(searchPrograms(fixturePrograms, '')).toEqual([])
  })

  it('returns empty array for whitespace-only query', () => {
    expect(searchPrograms(fixturePrograms, '   ')).toEqual([])
  })

  it('returns empty array for null / undefined query', () => {
    expect(searchPrograms(fixturePrograms, null)).toEqual([])
    expect(searchPrograms(fixturePrograms, undefined)).toEqual([])
  })

  it('returns empty array when programs is empty / invalid', () => {
    expect(searchPrograms([], 'lucy')).toEqual([])
    expect(searchPrograms(null, 'lucy')).toEqual([])
  })
})

describe('searchPrograms — teacher matching', () => {
  it('matches teacher by English name (case-insensitive)', () => {
    const results = searchPrograms(fixturePrograms, 'lucy')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-lucy')
    expect(results[0].matchType).toBe('teacher')
    // teacher 命中 → 整組 items
    expect(results[0].matchedItems).toHaveLength(3)
  })

  it('matches teacher by full display name', () => {
    const results = searchPrograms(fixturePrograms, 'Miss. Lucy 張老師')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-lucy')
  })

  it('matches teacher by local Chinese surname', () => {
    const results = searchPrograms(fixturePrograms, '蔡老師')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-candy')
    expect(results[0].matchType).toBe('teacher')
  })

  it('teacher match returns full items list for that teacher', () => {
    const results = searchPrograms(fixturePrograms, 'Candy')
    expect(results[0].matchedItems).toHaveLength(2)
  })
})

describe('searchPrograms — student matching', () => {
  it('matches student by performer display string', () => {
    const results = searchPrograms(fixturePrograms, '王錦聰')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-lucy')
    expect(results[0].matchType).toBe('item')
    // 兩筆都命中
    expect(results[0].matchedItems.map((i) => i.title)).toEqual([
      'My heart will go on',
      '卡農',
    ])
  })

  it('matches student inside performers[] array (group / ensemble)', () => {
    const results = searchPrograms(fixturePrograms, '何禹昕')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-candy')
    expect(results[0].matchType).toBe('item')
    expect(results[0].matchedItems).toHaveLength(1)
    expect(results[0].matchedItems[0].title).toBe('小星星')
  })

  it('matches the same student across multiple teachers (spec example)', () => {
    const results = searchPrograms(fixturePrograms, '吳映潔')
    expect(results).toHaveLength(2)
    const ids = results.map((r) => r.program.id)
    // 維持 JSON 原順序：morning-candy 在 afternoon-ben 之前
    expect(ids).toEqual(['morning-candy', 'afternoon-ben'])
    // 每組各有一筆對應 item，不應外洩其他學生
    expect(results[0].matchedItems).toHaveLength(1)
    expect(results[0].matchedItems[0].title).toBe('再見的時候')
    expect(results[1].matchedItems).toHaveLength(1)
    expect(results[1].matchedItems[0].title).toBe('理想混蛋-平衡木')
  })
})

describe('searchPrograms — title matching', () => {
  it('matches piece title (case-insensitive)', () => {
    const results = searchPrograms(fixturePrograms, 'windy hill')
    expect(results).toHaveLength(1)
    expect(results[0].program.id).toBe('morning-lucy')
    expect(results[0].matchedItems).toHaveLength(1)
    expect(results[0].matchedItems[0].performer).toBe('顏宇潔')
  })

  it('matches Chinese title with partial substring', () => {
    const results = searchPrograms(fixturePrograms, '卡農')
    expect(results).toHaveLength(1)
    expect(results[0].matchedItems).toHaveLength(1)
    expect(results[0].matchedItems[0].title).toBe('卡農')
  })
})

describe('searchPrograms — cross-session', () => {
  it('searches across morning and afternoon sessions', () => {
    const results = searchPrograms(fixturePrograms, '老師')
    // 所有四位老師的 teacherLocalName 都包含「老師」
    expect(results).toHaveLength(4)
    expect(results.map((r) => r.program.session)).toEqual([
      '上午場',
      '上午場',
      '下午場',
      '下午場',
    ])
  })
})

describe('searchPrograms — whitespace and case handling', () => {
  it('ignores leading / trailing whitespace', () => {
    const results = searchPrograms(fixturePrograms, '  王錦聰  ')
    expect(results).toHaveLength(1)
    expect(results[0].matchedItems).toHaveLength(2)
  })

  it('matches mixed-case English title', () => {
    const results = searchPrograms(fixturePrograms, 'MY HEART')
    expect(results).toHaveLength(1)
    expect(results[0].matchedItems).toHaveLength(1)
  })
})

describe('searchPrograms — no match', () => {
  it('returns empty array when nothing matches', () => {
    expect(searchPrograms(fixturePrograms, 'zzzzz')).toEqual([])
    expect(searchPrograms(fixturePrograms, '不存在的人')).toEqual([])
  })
})

describe('matchesProgram', () => {
  it('returns matched=false for empty query', () => {
    const result = matchesProgram('', fixturePrograms[0])
    expect(result.matched).toBe(false)
    expect(result.matchType).toBeNull()
    expect(result.matchedItems).toEqual([])
  })

  it('returns matched=false for null program', () => {
    const result = matchesProgram('lucy', null)
    expect(result.matched).toBe(false)
  })
})

describe('groupBySession', () => {
  it('groups programs by session and preserves order', () => {
    const groups = groupBySession(fixturePrograms)
    expect(groups).toHaveLength(2)
    expect(groups[0].session).toBe('上午場')
    expect(groups[0].sessionStartTime).toBe('10:00')
    expect(groups[0].programs.map((p) => p.id)).toEqual([
      'morning-candy',
      'morning-lucy',
    ])
    expect(groups[1].session).toBe('下午場')
    expect(groups[1].sessionStartTime).toBe('13:30')
    expect(groups[1].programs.map((p) => p.id)).toEqual([
      'afternoon-ben',
      'afternoon-yang',
    ])
  })

  it('returns empty array for invalid input', () => {
    expect(groupBySession([])).toEqual([])
    expect(groupBySession(null)).toEqual([])
  })
})
