import { prisma } from '@/lib/prisma'
import { NewsletterCard } from '@/components/newsletter/newsletter-card'

export const metadata = {
  title: 'Newsletter Archive — AI Times',
  description: 'Browse all past issues of the AI Times weekly intelligence briefing.',
}

export default async function NewslettersPage() {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      _count: {
        select: { items: true },
      },
    },
  })

  return (
    <div className="ft-container py-12">
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Archive
        </p>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Weekly Briefings
        </h1>
        <p className="text-ink-muted mt-2 max-w-xl">
          Every issue of the AI Times weekly intelligence briefing, from the most recent to our earliest editions.
        </p>
      </div>

      {/* Newsletter List */}
      {newsletters.length > 0 ? (
        <div>
          {newsletters.map(newsletter => (
            <NewsletterCard
              key={newsletter.id}
              id={newsletter.id}
              title={newsletter.title}
              summary={newsletter.summary}
              weekNumber={newsletter.weekNumber}
              year={newsletter.year}
              publishedAt={newsletter.publishedAt}
              itemCount={newsletter._count.items}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-serif text-2xl text-ink mb-2">
            No Issues Yet
          </h3>
          <p className="text-ink-muted">
            The first edition of AI Times is being prepared. Check back soon.
          </p>
        </div>
      )}
    </div>
  )
}

