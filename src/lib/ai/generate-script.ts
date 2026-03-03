import { getAIProvider } from './provider'
import type { ScrapedArticle } from '@/types'

/**
 * Generate a narration script (2-4 min spoken) for the daily video briefing.
 */
export async function generateScript(articles: ScrapedArticle[]): Promise<string> {
  const provider = getAIProvider()
  return provider.generateScript(articles)
}
