import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DailyUpdateContent } from '@/components/updates/daily-update-content'
import type { DailyUpdateData } from '@/types'
import type { Metadata } from 'next'

interface UpdatePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: UpdatePageProps): Promise<Metadata> {
  const { id } = await params
  const update = await prisma.dailyUpdate.findUnique({
    where: { id },
  })

  if (!update) {
    return { title: 'Update Not Found — AI Times' }
  }

  return {
    title: `${update.title} — AI Times Daily`,
    description: update.summary,
  }
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { id } = await params
  const update = await prisma.dailyUpdate.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { publishedAt: 'desc' },
      },
    },
  })

  if (!update) {
    notFound()
  }

  const data: DailyUpdateData = {
    id: update.id,
    title: update.title,
    summary: update.summary,
    script: update.script,
    videoUrl: update.videoUrl,
    audioUrl: update.audioUrl,
    date: update.date,
    publishedAt: update.publishedAt,
    items: update.items.map(item => ({
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
      <DailyUpdateContent update={data} />
    </div>
  )
}
