import { Resend } from 'resend'
import { render } from '@react-email/components'
import { WeeklyNewsletterEmail } from './templates/weekly-newsletter'
import { prisma } from '@/lib/prisma'
import type { NewsletterData } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewsletterWithItems {
  id: string
  title: string
  summary: string
  editorial: string
  weekNumber: number
  year: number
  publishedAt: Date
  items: {
    id: string
    title: string
    summary: string
    sourceUrl: string
    sourceName: string
    category: string
    imageUrl: string | null
    publishedAt: Date | null
  }[]
}

export async function sendNewsletterToSubscribers(
  newsletter: NewsletterWithItems
): Promise<void> {
  // Get all active subscribers
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: 'active' },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
  })

  if (activeSubscriptions.length === 0) {
    console.log('No active subscribers to send to')
    return
  }

  const newsletterData: NewsletterData = {
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

  const html = await render(WeeklyNewsletterEmail({ newsletter: newsletterData }))

  // Send in batches of 50
  const batchSize = 50

  for (let i = 0; i < activeSubscriptions.length; i += batchSize) {
    const batch = activeSubscriptions.slice(i, i + batchSize)

    await Promise.allSettled(
      batch.map(subscription =>
        resend.emails.send({
          from: 'AI Times <newsletter@aitimes.com>',
          to: subscription.user.email,
          subject: `${newsletter.title} — AI Times Week ${newsletter.weekNumber}`,
          html,
        })
      )
    )
  }

  console.log(`Sent newsletter to ${activeSubscriptions.length} subscribers`)
}

