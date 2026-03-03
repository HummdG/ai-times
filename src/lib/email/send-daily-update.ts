import { Resend } from 'resend'
import { render } from '@react-email/components'
import { DailyUpdateEmail } from './templates/daily-update-email'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

interface DailyUpdateWithItems {
  id: string
  title: string
  date: Date
  publishedAt: Date
  videoUrl: string | null
  audioUrl: string | null
  items: {
    title: string
    sourceUrl: string
    sourceName: string
  }[]
}

export async function sendDailyUpdateToSubscribers(
  update: DailyUpdateWithItems
): Promise<void> {
  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: 'active' },
    include: {
      user: {
        select: { email: true },
      },
    },
  })

  if (activeSubscriptions.length === 0) {
    console.log('No active subscribers to send to')
    return
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://aitimes.com'
  const watchUrl = `${baseUrl}/updates/${update.id}`

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(update.date)

  const html = await render(
    DailyUpdateEmail({
      title: update.title,
      date: formattedDate,
      watchUrl,
      items: update.items.map(item => ({
        title: item.title,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
      })),
    })
  )

  const batchSize = 50
  for (let i = 0; i < activeSubscriptions.length; i += batchSize) {
    const batch = activeSubscriptions.slice(i, i + batchSize)

    await Promise.allSettled(
      batch.map(subscription =>
        resend.emails.send({
          from: 'AI Times <newsletter@aitimes.com>',
          to: subscription.user.email,
          subject: `AI Times Daily — ${formattedDate}: ${update.title}`,
          html,
        })
      )
    )
  }

  console.log(`Sent daily update to ${activeSubscriptions.length} subscribers`)
}
