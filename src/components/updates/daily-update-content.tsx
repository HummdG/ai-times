import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { DailyUpdateData } from '@/types'
import styles from './daily-update-content.module.styl'

interface DailyUpdateContentProps {
  update: DailyUpdateData
}

export function DailyUpdateContent({ update }: DailyUpdateContentProps) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(update.date))

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.masthead}>
          <p className={styles.mastheadLabel}>AI Times Daily</p>
          <p className={styles.mastheadMeta}>{formattedDate}</p>
        </div>

        <hr className="ft-divider my-8" />

        <h1 className={styles.title}>{update.title}</h1>

        <hr className="ft-divider my-8" />

        <div className={styles.mediaSection}>
          {update.videoUrl ? (
            <div className={styles.videoWrapper}>
              <video
                src={update.videoUrl}
                controls
                className={styles.video}
                poster=""
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : update.audioUrl ? (
            <div className={styles.audioWrapper}>
              <audio src={update.audioUrl} controls className={styles.audio}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="text-ink-muted">No media available for this update.</p>
          )}
        </div>

        <hr className="ft-divider my-10" />

        <section className={styles.linksSection}>
          <h2 className="ft-section-label">Source links</h2>
          <p className="text-ink-muted text-sm mb-4">
            Click through to read the full articles — no more reading summaries.
          </p>
          <ul className={styles.linkList}>
            {update.items.map(item => (
              <li key={item.id} className={styles.linkItem}>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkTitle}
                >
                  {item.title}
                  <ExternalLink size={14} className="inline ml-1 opacity-60" />
                </a>
                <span className={styles.sourceName}>{item.sourceName}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarSticky}>
          <div className={styles.sidebarSection}>
            <h4 className="ft-section-label">In This Briefing</h4>
            <p className="text-ink-muted text-sm">
              {update.items.length} {update.items.length === 1 ? 'story' : 'stories'}
            </p>
          </div>

          <div className={styles.sidebarSection}>
            <h4 className="ft-section-label">Subscribe</h4>
            <p className="text-ink-muted text-sm">
              Receive AI Times daily, direct to your inbox.
            </p>
            <Link href="/sign-up" className="ft-button w-full text-center text-sm py-3">
              Subscribe — £9.99/mo
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
