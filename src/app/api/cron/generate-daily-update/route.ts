import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { aggregateNews } from '@/lib/scraper/aggregator'
import { getAIProvider } from '@/lib/ai/provider'
import { generateScript } from '@/lib/ai/generate-script'
import { generateAndUploadAudio } from '@/lib/video/elevenlabs-tts'
import { renderDailyBriefing } from '@/lib/video/render-daily-briefing'
import { sendDailyUpdateToSubscribers } from '@/lib/email/send-daily-update'

function getTodayDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = getTodayDate()

    const existing = await prisma.dailyUpdate.findUnique({
      where: { date: today },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Daily update already exists for today', id: existing.id },
        { status: 200 }
      )
    }

    console.log(`Generating daily update for ${today.toISOString().slice(0, 10)}...`)

    const { articles, grouped } = await aggregateNews()

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles found from any source' },
        { status: 404 }
      )
    }

    console.log(`Found ${articles.length} articles`)

    const aiProvider = getAIProvider()

    const [title, script] = await Promise.all([
      aiProvider.generateTitle(articles),
      generateScript(articles),
    ])

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

    const categoryNames = Object.entries(grouped)
      .filter(([, items]) => items.length > 0)
      .map(([cat]) => cat)
    const summary = `Today covers ${articles.length} developments across ${categoryNames.join(', ')}.`

    let audioUrl: string | null = null
    try {
      audioUrl = await generateAndUploadAudio(script)
      console.log('Audio generated:', audioUrl)
    } catch (audioErr) {
      console.error('Audio generation failed:', audioErr)
      return NextResponse.json(
        { error: 'Audio generation failed' },
        { status: 500 }
      )
    }

    let videoUrl: string | null = null
    if (audioUrl) {
      videoUrl = await renderDailyBriefing({
        audioUrl,
        title,
        items: summarizedArticles.map(a => ({
          title: a.title,
          sourceUrl: a.link,
          sourceName: a.sourceName,
        })),
      })
      if (videoUrl) {
        console.log('Video generated:', videoUrl)
      } else {
        console.warn('Video render failed, storing audio-only')
      }
    }

    const dailyUpdate = await prisma.dailyUpdate.create({
      data: {
        title,
        summary,
        script,
        videoUrl,
        audioUrl,
        date: today,
        publishedAt: new Date(),
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

    try {
      await sendDailyUpdateToSubscribers(dailyUpdate)
      console.log('Daily update sent to subscribers')
    } catch (emailError) {
      console.error('Failed to send emails:', emailError)
    }

    return NextResponse.json({
      message: 'Daily update generated successfully',
      id: dailyUpdate.id,
      title: dailyUpdate.title,
      videoUrl: dailyUpdate.videoUrl,
      audioUrl: dailyUpdate.audioUrl,
      itemCount: dailyUpdate.items.length,
    })
  } catch (error) {
    console.error('Daily update generation failed:', error)
    return NextResponse.json(
      { error: 'Daily update generation failed' },
      { status: 500 }
    )
  }
}
