import { prisma } from '@/lib/prisma'
import { UpdateCard } from '@/components/updates/update-card'

export const metadata = {
  title: 'Daily Updates — AI Times',
  description: 'Watch your AI Times daily video briefings.',
}

export default async function UpdatesPage() {
  const updates = await prisma.dailyUpdate.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      _count: {
        select: { items: true },
      },
    },
  })

  return (
    <div className="ft-container py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Archive
        </p>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Daily Briefings
        </h1>
        <p className="text-ink-muted mt-2 max-w-xl">
          Your AI Times daily video briefings. Watch or listen, then click through to the sources.
        </p>
      </div>

      {updates.length > 0 ? (
        <div>
          {updates.map(update => (
            <UpdateCard
              key={update.id}
              id={update.id}
              title={update.title}
              summary={update.summary}
              date={update.date}
              publishedAt={update.publishedAt}
              itemCount={update._count.items}
              hasVideo={!!update.videoUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-serif text-2xl text-ink mb-2">
            No Updates Yet
          </h3>
          <p className="text-ink-muted">
            The first daily briefing is being prepared. Check back soon.
          </p>
        </div>
      )}
    </div>
  )
}
