import type { NewsCategory } from '@/types'

export interface Source {
  name: string
  url: string
  type: 'rss' | 'atom'
  category: NewsCategory
}

export const SOURCES: Source[] = [
  // Major Labs
  {
    name: 'OpenAI',
    url: 'https://openai.com/blog/rss.xml',
    type: 'rss',
    category: 'from-the-labs',
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/rss.xml',
    type: 'rss',
    category: 'from-the-labs',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    type: 'rss',
    category: 'from-the-labs',
  },
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    type: 'rss',
    category: 'from-the-labs',
  },
  {
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/rss/',
    type: 'rss',
    category: 'from-the-labs',
  },
  {
    name: 'Microsoft Research',
    url: 'https://www.microsoft.com/en-us/research/feed/',
    type: 'rss',
    category: 'from-the-labs',
  },

  // Research
  {
    name: 'arXiv CS.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    category: 'research-frontiers',
  },
  {
    name: 'arXiv CS.CL',
    url: 'https://rss.arxiv.org/rss/cs.CL',
    type: 'rss',
    category: 'research-frontiers',
  },
  {
    name: 'arXiv CS.LG',
    url: 'https://rss.arxiv.org/rss/cs.LG',
    type: 'rss',
    category: 'research-frontiers',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    type: 'atom',
    category: 'research-frontiers',
  },

  // Industry
  {
    name: 'NVIDIA AI Blog',
    url: 'https://blogs.nvidia.com/feed/',
    type: 'rss',
    category: 'industry-moves',
  },
  {
    name: 'AWS AI Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    type: 'rss',
    category: 'industry-moves',
  },

  // Tech Press
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    type: 'rss',
    category: 'in-brief',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    type: 'rss',
    category: 'in-brief',
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'rss',
    category: 'in-brief',
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/feed/',
    type: 'rss',
    category: 'in-brief',
  },
]

