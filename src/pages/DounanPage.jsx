import EventHero from '../components/EventHero.jsx'
import SectionNav from '../components/SectionNav.jsx'
import ContactSection from '../components/ContactSection.jsx'

// Wave 3 預覽版：用 Wave 3 三個元件 + 假 section 占位
// Wave 5 Agent F 會用真實 Section 元件覆蓋

const DOUNAN_TABS = [
  { id: 'venue', label: '場地資訊' },
  { id: 'schedule', label: '時間表' },
  { id: 'program', label: '節目表' },
  { id: 'lost', label: '我迷路了' },
  { id: 'contact', label: '聯絡我們' },
]

const placeholderSection = {
  minHeight: '70vh',
  padding: '2rem 1.5rem',
  borderTop: '1px dashed var(--color-line-beige)',
  fontFamily: 'var(--font-body)',
  color: 'var(--color-text-secondary)',
}

export default function DounanPage() {
  return (
    <>
      <EventHero eventId="dounan" />
      <SectionNav tabs={DOUNAN_TABS} />

      <main style={{ maxWidth: 720, margin: '0 auto' }}>
        <section id="venue" style={placeholderSection}>
          <h2>場地資訊（Wave 4 Agent D）</h2>
          <p>DounanVenueSection 將顯示在此。</p>
        </section>
        <section id="schedule" style={placeholderSection}>
          <h2>時間表（Wave 4 Agent D）</h2>
          <p>DounanScheduleSection 將顯示在此。</p>
        </section>
        <section id="program" style={placeholderSection}>
          <h2>節目表（Wave 4 Agent D）</h2>
          <p>DounanProgramSection 將顯示在此。</p>
        </section>
        <section id="lost" style={placeholderSection}>
          <h2>我迷路了（Wave 4 Agent D）</h2>
          <p>DounanLostSection 將顯示在此。</p>
        </section>
        <ContactSection id="contact" />
      </main>
    </>
  )
}
