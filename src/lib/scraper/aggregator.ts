import type { ScrapedArticle, NewsCategory } from '@/types'
import { SOURCES } from './sources'
import { fetchAllSources } from './fetcher'

function deduplicateArticles(articles: ScrapedArticle[]): ScrapedArticle[] {
  const seen = new Set<string>()
  const deduplicated: ScrapedArticle[] = []

  for (const article of articles) {
    // Normalize title for deduplication
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Also check URL uniqueness
    const normalizedUrl = article.link.toLowerCase().replace(/\/$/, '')

    if (!seen.has(normalizedTitle) && !seen.has(normalizedUrl)) {
      seen.add(normalizedTitle)
      seen.add(normalizedUrl)
      deduplicated.push(article)
    }
  }

  return deduplicated
}

function sortByDate(articles: ScrapedArticle[]): ScrapedArticle[] {
  return [...articles].sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0
    if (!a.pubDate) return 1
    if (!b.pubDate) return -1
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })
}

function groupByCategory(
  articles: ScrapedArticle[]
): Record<NewsCategory, ScrapedArticle[]> {
  const grouped: Record<NewsCategory, ScrapedArticle[]> = {
    'from-the-labs': [],
    'research-frontiers': [],
    'industry-moves': [],
    'in-brief': [],
  }

  for (const article of articles) {
    grouped[article.category].push(article)
  }

  return grouped
}

const MAX_ARTICLES_PER_CATEGORY = 3
const MAX_TOTAL_ARTICLES = 12

export async function aggregateNews(): Promise<{
  articles: ScrapedArticle[]
  grouped: Record<NewsCategory, ScrapedArticle[]>
}> {
  console.log(`Fetching from ${SOURCES.length} sources...`)
  const rawArticles = await fetchAllSources(SOURCES)
  console.log(`Fetched ${rawArticles.length} raw articles`)

  const deduplicated = deduplicateArticles(rawArticles)
  console.log(`${deduplicated.length} articles after deduplication`)

  const sorted = sortByDate(deduplicated)

  // Group by category and limit
  const grouped = groupByCategory(sorted)

  for (const category of Object.keys(grouped) as NewsCategory[]) {
    grouped[category] = grouped[category].slice(0, MAX_ARTICLES_PER_CATEGORY)
  }

  // Flatten back for total limit
  const allArticles = Object.values(grouped)
    .flat()
    .slice(0, MAX_TOTAL_ARTICLES)

  return {
    articles: allArticles,
    grouped,
  }
}

