import { events } from '../data/siteData.js'
import exploration from '../../data/style-explorations.json'
import styles from './StyleExplorationPage.module.css'

const MUSIC_ASSET_BASE = `${import.meta.env.BASE_URL}assets/music-components/`

function VariantPreview({ variant }) {
  const navLabels = Array.isArray(exploration.navLabels) ? exploration.navLabels : []

  return (
    <article className={`${styles.variant} ${styles[variant.id]}`}>
      <div className={styles.variantHeader}>
        <h2>{variant.name}</h2>
        <p>{variant.intent}</p>
      </div>

      <div className={styles.mockupGrid}>
        <section className={styles.phoneFrame} aria-label={`${variant.name} ${exploration.eventLabel}`}>
          <span className={styles.previewLabel}>{exploration.eventLabel}</span>
          <div className={styles.eventMockup}>
            <Decor variantId={variant.id} compact />
            <a className={styles.backLink}>{exploration.backLabel}</a>
            <p className={styles.kicker}>{variant.eventKicker}</p>
            <h3>{variant.eventTitle}</h3>
            <p className={styles.date}>{exploration.dateLabel}</p>
            <nav className={styles.tabBar} aria-label="示意導覽列">
              {navLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </nav>
          </div>
        </section>
      </div>
    </article>
  )
}

function Decor({ variantId, compact = false }) {
  const hasMascots = variantId.startsWith('poster-mascot')

  if (hasMascots || variantId === 'instrument-corners' || variantId === 'stage-map' || variantId === 'full-poster') {
    return (
      <>
        <img
          src={`${MUSIC_ASSET_BASE}piano-01.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.instrument} ${styles.piano} ${styles[`${variantId}Piano`] ?? ''}`}
        />
        <img
          src={`${MUSIC_ASSET_BASE}drum-01.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.instrument} ${styles.drum} ${styles[`${variantId}Drum`] ?? ''}`}
        />
        {!compact || variantId === 'poster-mascot-guitar' ? (
          <img
            src={`${MUSIC_ASSET_BASE}guitar-01.png`}
            alt=""
            aria-hidden="true"
            className={`${styles.instrument} ${styles.guitar} ${styles[`${variantId}Guitar`] ?? ''}`}
          />
        ) : null}
        <SmallDecor variantId={variantId} />
      </>
    )
  }

  return <SmallDecor variantId={variantId} />
}

function SmallDecor({ variantId }) {
  return (
    <>
      <span className={`${styles.note} ${styles.noteA}`} aria-hidden="true">♪</span>
      <span className={`${styles.note} ${styles.noteB}`} aria-hidden="true">♫</span>
      <span className={`${styles.spark} ${styles.sparkA}`} aria-hidden="true" />
      <span className={`${styles.spark} ${styles.sparkB}`} aria-hidden="true" />
    </>
  )
}

export default function StyleExplorationPage() {
  const constrained = exploration.variants.filter((variant) => variant.scope === 'constrained')
  const free = exploration.variants.filter((variant) => variant.scope === 'free')

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <p>{events.brand.displayName}</p>
        <h1>{exploration.pageTitle}</h1>
        <span />
        <p>{exploration.pageIntro}</p>
      </header>

      <section className={styles.variantSection} aria-labelledby="constrained-style-title">
        <h2 id="constrained-style-title">{exploration.constrainedTitle}</h2>
        <div className={styles.variantList}>
          {constrained.map((variant) => (
            <VariantPreview key={variant.id} variant={variant} />
          ))}
        </div>
      </section>

      {free.length > 0 ? (
        <section className={styles.variantSection} aria-labelledby="free-style-title">
          <h2 id="free-style-title">{exploration.freeTitle}</h2>
          <div className={styles.variantList}>
            {free.map((variant) => (
              <VariantPreview key={variant.id} variant={variant} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
