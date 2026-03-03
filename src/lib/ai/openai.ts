import OpenAI from 'openai'
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

const SCRIPT_SYSTEM_PROMPT = `You are the anchor of "AI Times Daily", a video briefing on AI news.
Write a narration script (2-4 minutes when spoken) from these articles. Use British English.
The script should:
- Open with a brief intro ("This is AI Times Daily for [date]...")
- Flow naturally from one story to the next—no bullet points or list formatting
- Summarise each development conversationally, as if reading a news bulletin
- Include a brief sign-off ("That's AI Times Daily. Full links are below.")
- Be 400-600 words (roughly 3-4 minutes at typical speaking pace)
- Sound authoritative and measured, like a professional newsreader
Output plain text only. No markdown, no headers. Write in continuous prose.`

export function createOpenAIProvider(): AIProvider {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  return {
    async summarizeArticle(article: ScrapedArticle): Promise<string> {
      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Summarize this article:\n\nTitle: ${article.title}\nSource: ${article.sourceName}\nContent: ${article.snippet}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      })

      return response.choices[0].message.content ?? article.snippet
    },

    async generateEditorial(articles: ScrapedArticle[]): Promise<string> {
      const articleList = articles
        .map(a => `- ${a.title} (${a.sourceName}): ${a.snippet.substring(0, 150)}`)
        .join('\n')

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: EDITORIAL_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Write the editorial introduction for this week's AI Times, based on these articles:\n\n${articleList}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 600,
      })

      return response.choices[0].message.content ?? ''
    },

    async generateTitle(articles: ScrapedArticle[]): Promise<string> {
      const topArticles = articles.slice(0, 5)
        .map(a => `- ${a.title} (${a.sourceName})`)
        .join('\n')

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: TITLE_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Generate a headline for this week's newsletter based on:\n\n${topArticles}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 50,
      })

      return response.choices[0].message.content?.trim() ?? 'This Week in AI'
    },

    async generateScript(articles: ScrapedArticle[]): Promise<string> {
      const articleList = articles
        .map(a => `- ${a.title} (${a.sourceName}): ${a.snippet.substring(0, 200)}`)
        .join('\n')

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SCRIPT_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Write the narration script for today's AI Times Daily video briefing, based on these articles:\n\n${articleList}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      })

      return response.choices[0].message.content?.trim() ?? ''
    },
  }
}

