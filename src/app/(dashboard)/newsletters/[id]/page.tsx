import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { NewsletterContent } from '@/components/newsletter/newsletter-content'
import type { NewsletterData } from '@/types'
import type { Metadata } from 'next'

interface NewsletterPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  const { id } = await params
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  })

  if (!newsletter) {
    return { title: 'Newsletter Not Found — AI Times' }
  }

  return {
    title: `${newsletter.title} — AI Times`,
    description: newsletter.summary,
  }
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  const { id } = await params
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { publishedAt: 'desc' },
      },
    },
  })

  if (!newsletter) {
    notFound()
  }

  const data: NewsletterData = {
    id: newsletter.id,
    title: newsletter.title,
    summary: newsletter.summary,
    editorial: newsletter.editorial,
    weekNumber: newsletter.weekNumber,
    year: newsletter.year,
    publishedAt: newsletter.publishedAt,
    items: newsletter.items.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      category: item.category,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
    })),
  }

  return (
    <div className="ft-container py-12">
      <NewsletterContent newsletter={data} />
    </div>
  )
}

