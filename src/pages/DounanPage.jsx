import EventHero from '../components/EventHero.jsx'
import SectionNav from '../components/SectionNav.jsx'
import DounanVenueSection from '../components/DounanVenueSection.jsx'
import DounanScheduleSection from '../components/DounanScheduleSection.jsx'
import DounanProgramSection from '../components/DounanProgramSection.jsx'
import MarketSection from '../components/MarketSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

const DOUNAN_TABS = [
  { id: 'venue', label: '場地資訊' },
  { id: 'schedule', label: '流程表' },
  { id: 'program', label: '節目表' },
  { id: 'market', label: '小市集' },
  { id: 'contact', label: '聯絡我們' },
]

export default function DounanPage() {
  return (
    <>
      <EventHero eventId="dounan" />
      <SectionNav tabs={DOUNAN_TABS} />
      <DounanVenueSection id="venue" />
      <DounanScheduleSection id="schedule" />
      <DounanProgramSection id="program" />
      <MarketSection id="market" />
      <ContactSection id="contact" />
    </>
  )
}
