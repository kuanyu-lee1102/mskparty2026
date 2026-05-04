import EventHero from '../components/EventHero.jsx'
import SectionNav from '../components/SectionNav.jsx'
import DounanVenueSection from '../components/DounanVenueSection.jsx'
import DounanScheduleSection from '../components/DounanScheduleSection.jsx'
import DounanProgramSection from '../components/DounanProgramSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

// Wave 4 預覽版：用真實 Section 元件 + Wave 3 EventHero/SectionNav/ContactSection
// Wave 5 Agent F 會以正式 page assembly + 部署設定覆蓋
// 「我迷路了」區塊已移除（與場地資訊重複，無實質協助效益）

const DOUNAN_TABS = [
  { id: 'venue', label: '場地資訊' },
  { id: 'schedule', label: '時間表' },
  { id: 'program', label: '節目表' },
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
      <ContactSection id="contact" />
    </>
  )
}
