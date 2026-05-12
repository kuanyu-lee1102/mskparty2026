import events from '../../data/events.json'
import venueDounan from '../../data/venue.dounan.json'
import venueZhubei from '../../data/venue.zhubei.json'
import schedules from '../../data/schedules.public.json'
import programsDounan from '../../data/programs.dounan.json'
import contacts from '../../data/contacts.json'
import market from '../../data/market.json'

const SOURCE_PREFIX = 'source-materials/'

export function assetUrl(rawPath) {
  if (typeof rawPath !== 'string' || rawPath.length === 0) return ''
  if (rawPath.startsWith(SOURCE_PREFIX)) {
    return `${import.meta.env.BASE_URL}assets/${rawPath.slice(SOURCE_PREFIX.length)}`
  }
  return rawPath
}

export {
  events,
  venueDounan,
  venueZhubei,
  schedules,
  programsDounan,
  contacts,
  market,
}

export default {
  events,
  venueDounan,
  venueZhubei,
  schedules,
  programsDounan,
  contacts,
  market,
}
