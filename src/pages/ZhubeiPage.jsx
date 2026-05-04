import EventHero from '../components/EventHero.jsx'
import SectionNav from '../components/SectionNav.jsx'
import ZhubeiVenueSection from '../components/ZhubeiVenueSection.jsx'
import ZhubeiScheduleSection from '../components/ZhubeiScheduleSection.jsx'
import ZhubeiProgramSection from '../components/ZhubeiProgramSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

// Wave 4 預覽版：用真實 Section 元件 + Wave 3 EventHero/SectionNav/ContactSection
// Wave 5 Agent F 會以正式 page assembly + 部署設定覆蓋

const ZHUBEI_TABS = [
  { id: 'venue', label: '場地資訊' },
  { id: 'schedule', label: '時間表' },
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
