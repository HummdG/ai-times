import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, ScrapedArticle } from '@/types'

const SUMMARIZE_SYSTEM_PROMPT = `You are a senior editor at a prestigious AI publication called "AI Times", modelled after the Financial Times. 
Your writing is authoritative, precise, and journalistic in tone. You write in British English.
When summarizing articles, produce exactly 2-3 concise sentences that:
- State what happened or was discovered
- Explain why it matters
- Use clear, sophisticated language without jargon or hype`

const EDITORIAL_SYSTEM_PROMPT = `You are the editor-in-chief of "AI Times", a prestigious weekly AI newsletter modelled after the Financial Times.
Write a compelling editorial introduction (3-4 paragraphs) for this week's issue. Use British English.
The editorial should:
- Open with the most significant development of the week
- Provide context on why this week's developments matter
- Connect different themes across the articles
- Maintain an authoritative, measured, yet engaging tone
- Avoid hyperbole and buzzwords
Do not use markdown formatting. Write in plain prose.`

const TITLE_SYSTEM_PROMPT = `You are the editor-in-chief of "AI Times", a prestigious weekly AI newsletter.
Generate a single compelling headline for this week's newsletter issue.
The title should:
- Be 6-12 words
- Reference the most significant development
- Sound like a Financial Times headline — authoritative, concise, no clickbait
Return only the title, nothing else.`

export function createAnthropicProvider(): AIProvider {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  return {
    async summarizeArticle(article: ScrapedArticle): Promise<string> {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: SUMMARIZE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Summarize this article:\n\nTitle: ${article.title}\nSource: ${article.sourceName}\nContent: ${article.snippet}`,
          },
        ],
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return textBlock && 'text' in textBlock ? textBlock.text : article.snippet
    },

    async generateEditorial(articles: ScrapedArticle[]): Promise<string> {
      const articleList = articles
        .map(a => `- ${a.title} (${a.sourceName}): ${a.snippet.substring(0, 150)}`)
        .join('\n')

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: EDITORIAL_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Write the editorial introduction for this week's AI Times, based on these articles:\n\n${articleList}`,
          },
        ],
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return textBlock && 'text' in textBlock ? textBlock.text : ''
    },

    async generateTitle(articles: ScrapedArticle[]): Promise<string> {
      const topArticles = articles.slice(0, 5)
        .map(a => `- ${a.title} (${a.sourceName})`)
        .join('\n')

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        system: TITLE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Generate a headline for this week's newsletter based on:\n\n${topArticles}`,
          },
        ],
      })

      const textBlock = response.content.find(block => block.type === 'text')
      return textBlock && 'text' in textBlock ? textBlock.text.trim() : 'This Week in AI'
    },
  }
}

