import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { NEWS_CATEGORIES, type NewsCategory, type NewsletterData } from '@/types'
import styles from './newsletter-content.module.styl'

interface NewsletterContentProps {
  newsletter: NewsletterData
}

export function NewsletterContent({ newsletter }: NewsletterContentProps) {
  const groupedItems = newsletter.items.reduce((acc, item) => {
    const category = item.category as NewsCategory
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof newsletter.items>)

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(newsletter.publishedAt))

  const categories = Object.keys(NEWS_CATEGORIES) as NewsCategory[]

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Masthead */}
        <div className={styles.masthead}>
          <p className={styles.mastheadLabel}>AI Times Weekly</p>
          <p className={styles.mastheadMeta}>
            Week {newsletter.weekNumber}, {newsletter.year} &bull; {formattedDate}
          </p>
        </div>

        <hr className="ft-divider my-8" />

        {/* Title */}
        <h1 className={styles.title}>{newsletter.title}</h1>

        <hr className="ft-divider my-8" />

        {/* Editorial */}
        <div className={styles.editorial}>
          {newsletter.editorial.split('\n\n').map((paragraph, index) => (
            <p key={index} className={styles.editorialParagraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <hr className="ft-divider my-10" />

        {/* News Sections */}
        {categories.map(category => {
          const items = groupedItems[category]
          if (!items || items.length === 0) return null

          return (
            <section key={category} className={styles.section}>
              <div className="ft-section-label">
                {NEWS_CATEGORIES[category]}
              </div>

              <div className={styles.itemList}>
                {items.map(item => (
                  <article key={item.id} className={styles.item}>
                    <h3 className={styles.itemTitle}>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.itemTitleLink}
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className={styles.itemSummary}>{item.summary}</p>
                    <div className={styles.itemMeta}>
                      <span className={styles.sourceName}>{item.sourceName}</span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.readMore}
                      >
                        Read full article <ExternalLink size={12} className="inline ml-1" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSticky}>
          {/* Table of Contents */}
          <div className={styles.sidebarSection}>
            <h4 className="ft-section-label">In This Issue</h4>
            <nav>
              {categories.map(category => {
                const items = groupedItems[category]
                if (!items || items.length === 0) return null

                return (
                  <div key={category} className={styles.tocCategory}>
                    <p className={styles.tocCategoryLabel}>
                      {NEWS_CATEGORIES[category]}
                    </p>
                    <p className={styles.tocCount}>
                      {items.length} {items.length === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Subscribe CTA */}
          <div className={styles.sidebarSection}>
            <h4 className="ft-section-label">Subscribe</h4>
            <p className={styles.sidebarText}>
              Receive AI Times every week, direct to your inbox.
            </p>
            <Link href="/sign-up" className="ft-button w-full text-center text-sm py-3">
              Subscribe — &pound;9.99/mo
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

