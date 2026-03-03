export interface NewsItemData {
  id: string
  title: string
  summary: string
  sourceUrl: string
  sourceName: string
  category: string
  imageUrl?: string | null
  publishedAt?: Date | null
}

export interface NewsletterData {
  id: string
  title: string
  summary: string
  editorial: string
  weekNumber: number
  year: number
  publishedAt: Date
  items: NewsItemData[]
}

export interface DailyUpdateData {
  id: string
  title: string
  summary: string
  script: string
  videoUrl: string | null
  audioUrl: string | null
  date: Date
  publishedAt: Date
  items: NewsItemData[]
}

export interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  subscription: SubscriptionData | null
}

export interface SubscriptionData {
  id: string
  status: string
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export type NewsCategory =
  | 'from-the-labs'
  | 'research-frontiers'
  | 'industry-moves'
  | 'in-brief'

export const NEWS_CATEGORIES: Record<NewsCategory, string> = {
  'from-the-labs': 'From the Labs',
  'research-frontiers': 'Research Frontiers',
  'industry-moves': 'Industry Moves',
  'in-brief': 'In Brief',
} as const

export interface ScrapedArticle {
  title: string
  link: string
  snippet: string
  pubDate: string | null
  sourceName: string
  category: NewsCategory
}

export interface AIProvider {
  summarizeArticle: (article: ScrapedArticle) => Promise<string>
  generateEditorial: (articles: ScrapedArticle[]) => Promise<string>
  generateTitle: (articles: ScrapedArticle[]) => Promise<string>
  generateScript: (articles: ScrapedArticle[]) => Promise<string>
}

