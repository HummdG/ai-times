import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Play } from 'lucide-react'

interface UpdateCardProps {
  id: string
  title: string
  summary: string
  date: Date
  publishedAt: Date
  itemCount: number
  hasVideo: boolean
}

export function UpdateCard({
  id,
  title,
  summary,
  date,
  publishedAt,
  itemCount,
  hasVideo,
}: UpdateCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

  return (
    <article className="border-t border-divider pt-6 pb-6 group">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="secondary"
              className="bg-wheat text-ink-muted text-[0.65rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-none"
            >
              {formattedDate}
            </Badge>
            {hasVideo && (
              <span className="flex items-center gap-1 text-xs text-ink-light">
                <Play size={12} /> Video
              </span>
            )}
          </div>

          <Link href={`/updates/${id}`} className="no-underline hover:no-underline">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-tight mb-2">
              {title}
            </h3>
          </Link>

          <p className="text-ink-muted text-base leading-relaxed line-clamp-2">
            {summary}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-ink-light">{itemCount} stories</span>
          </div>
        </div>
      </div>
    </article>
  )
}
