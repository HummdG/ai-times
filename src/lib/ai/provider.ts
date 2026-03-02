import type { AIProvider } from '@/types'
import { createOpenAIProvider } from './openai'
import { createAnthropicProvider } from './anthropic'

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'openai'

  switch (provider) {
    case 'anthropic':
      return createAnthropicProvider()
    case 'openai':
    default:
      return createOpenAIProvider()
  }
}

