import EventHero from '../components/EventHero.jsx'
import SectionNav from '../components/SectionNav.jsx'
import ZhubeiVenueSection from '../components/ZhubeiVenueSection.jsx'
import ZhubeiScheduleSection from '../components/ZhubeiScheduleSection.jsx'
import ZhubeiProgramSection from '../components/ZhubeiProgramSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

const ZHUBEI_TABS = [
  { id: 'venue', label: '場地資訊' },
  { id: 'schedule', label: '流程表' },
  { id: 'program', label: '節目表' },
  { id: 'contact', label: '聯絡我們' },
]

export default function ZhubeiPage() {
  return (
    <>
      <EventHero eventId="zhubei" />
      <SectionNav tabs={ZHUBEI_TABS} />
      <ZhubeiVenueSection id="venue" />
      <ZhubeiScheduleSection id="schedule" />
      <ZhubeiProgramSection id="program" />
      <ContactSection id="contact" />
    </>
  )
}
