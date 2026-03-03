import Parser from 'rss-parser'
import type { ScrapedArticle, NewsCategory } from '@/types'
import type { Source } from './sources'

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'AI Times Newsletter Bot/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml',
  },
})

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export async function fetchSource(source: Source): Promise<ScrapedArticle[]> {
  try {
    const feed = await parser.parseURL(source.url)

    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const articles: ScrapedArticle[] = []

    for (const item of feed.items) {
      if (!item.title || !item.link) continue

      const pubDate = item.pubDate ? new Date(item.pubDate) : null

      // Filter to last 24 hours if date available
      if (pubDate && pubDate < oneDayAgo) continue

      const snippet = item.contentSnippet
        || item.content
        || item.summary
        || ''

      articles.push({
        title: stripHtml(item.title),
        link: item.link,
        snippet: truncate(stripHtml(snippet), 500),
        pubDate: pubDate?.toISOString() ?? null,
        sourceName: source.name,
        category: source.category,
      })
    }

    // Limit to 5 most recent per source
    return articles.slice(0, 5)
  } catch (error) {
    console.error(`Failed to fetch ${source.name} (${source.url}):`, error)
    return []
  }
}

export async function fetchAllSources(sources: Source[]): Promise<ScrapedArticle[]> {
  const results = await Promise.allSettled(
    sources.map(source => fetchSource(source))
  )

  const articles: ScrapedArticle[] = []

  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    }
  }

  return articles
}

