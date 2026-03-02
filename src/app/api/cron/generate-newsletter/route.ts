import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { aggregateNews } from '@/lib/scraper/aggregator'
import { getAIProvider } from '@/lib/ai/provider'
import { sendNewsletterToSubscribers } from '@/lib/email/send-newsletter'

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - startOfYear.getTime()
  const oneWeek = 604800000
  return Math.ceil((diff / oneWeek) + 1)
}

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const weekNumber = getWeekNumber(now)
    const year = now.getFullYear()

    // Check if newsletter already exists for this week
    const existing = await prisma.newsletter.findUnique({
      where: { weekNumber_year: { weekNumber, year } },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Newsletter already exists for this week', id: existing.id },
        { status: 200 }
      )
    }

    console.log(`Generating newsletter for Week ${weekNumber}, ${year}...`)

    // Step 1: Aggregate news from all sources
    const { articles, grouped } = await aggregateNews()

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles found from any source' },
        { status: 404 }
      )
    }

    console.log(`Found ${articles.length} articles, generating AI content...`)

    // Step 2: AI summarization
    const aiProvider = getAIProvider()

    // Generate title and editorial in parallel
    const [title, editorial] = await Promise.all([
      aiProvider.generateTitle(articles),
      aiProvider.generateEditorial(articles),
    ])

    // Summarize individual articles (with concurrency limit)
    const summarizedArticles = []
    const batchSize = 5

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize)
      const summaries = await Promise.all(
        batch.map(async article => ({
          ...article,
          summary: await aiProvider.summarizeArticle(article),
        }))
      )
      summarizedArticles.push(...summaries)
    }

    // Step 3: Build the overall summary
    const categoryNames = Object.entries(grouped)
      .filter(([, items]) => items.length > 0)
      .map(([cat]) => cat)

    const summary = `Week ${weekNumber} covers ${articles.length} developments across ${categoryNames.length} categories: ${categoryNames.join(', ')}.`

    // Step 4: Save to database
    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        summary,
        editorial,
        weekNumber,
        year,
        publishedAt: now,
        items: {
          create: summarizedArticles.map(article => ({
            title: article.title,
            summary: article.summary,
            sourceUrl: article.link,
            sourceName: article.sourceName,
            category: article.category,
            publishedAt: article.pubDate ? new Date(article.pubDate) : null,
          })),
        },
      },
      include: { items: true },
    })

    console.log(`Newsletter created: ${newsletter.id}`)

    // Step 5: Send to subscribers
    try {
      await sendNewsletterToSubscribers(newsletter)
      console.log('Newsletter sent to subscribers')
    } catch (emailError) {
      console.error('Failed to send newsletter emails:', emailError)
      // Don't fail the whole request if email sending fails
    }

    return NextResponse.json({
      message: 'Newsletter generated successfully',
      id: newsletter.id,
      title: newsletter.title,
      itemCount: newsletter.items.length,
    })
  } catch (error) {
    console.error('Newsletter generation failed:', error)
    return NextResponse.json(
      { error: 'Newsletter generation failed' },
      { status: 500 }
    )
  }
}

